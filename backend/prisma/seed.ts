import { PrismaClient, DiscountType, FoodType, OrderStatus, Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const price = (value: number): Prisma.Decimal => new Prisma.Decimal(value.toFixed(2));

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@zhonix.com" },
    update: { passwordHash, name: "Admin User", role: Role.SUPER_ADMIN },
    create: {
      email: "admin@zhonix.com",
      name: "Admin User",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  const categoryRows = await Promise.all(
    [
      ["Main Course", "main-course"],
      ["Starters", "starters"],
      ["Rice", "rice"],
      ["Beverages", "beverages"],
      ["Dessert", "dessert"],
    ].map(([name, slug]) =>
      prisma.category.upsert({
        where: { slug },
        update: { name },
        create: { name, slug },
      }),
    ),
  );

  const categoryMap = new Map(categoryRows.map((category) => [category.slug, category.id]));

  const menuItems = [
    { name: "Paneer Lababdar", price: 320, foodType: FoodType.VEG, likes: 45, slug: "main-course" },
    { name: "Kaju Curry", price: 300, foodType: FoodType.VEG, likes: 40, slug: "main-course" },
    { name: "Paneer Tikka", price: 280, foodType: FoodType.VEG, likes: 38, slug: "starters" },
    { name: "Crispy Corn", price: 240, foodType: FoodType.VEG, likes: 43, slug: "starters" },
    { name: "Ice Cream", price: 150, foodType: FoodType.VEG, likes: 44, slug: "dessert" },
    { name: "Chicken Tikka", price: 350, foodType: FoodType.NON_VEG, likes: 41, slug: "starters" },
    { name: "Mutton Biryani", price: 420, foodType: FoodType.NON_VEG, likes: 39, slug: "rice" },
    { name: "Virgin Mojito", price: 180, foodType: FoodType.VEG, likes: 36, slug: "beverages" },
  ];

  for (const item of menuItems) {
    const categoryId = categoryMap.get(item.slug);
    if (!categoryId) continue;
    await prisma.menuItem.upsert({
      where: {
        name_categoryId: {
          name: item.name,
          categoryId,
        },
      },
      update: {
        price: price(item.price),
        foodType: item.foodType,
        likes: item.likes,
      },
      create: {
        name: item.name,
        price: price(item.price),
        foodType: item.foodType,
        likes: item.likes,
        categoryId,
      },
    });
  }

  const now = new Date();
  const offers = [
    {
      title: "Weekend Special",
      description: "Enjoy 20% off on all mains this weekend",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      promoCode: "WEEKEND20",
      imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
    },
    {
      title: "Lunch Combo Deal",
      description: "Get any main course with a beverage for flat ₹50 off",
      discountType: DiscountType.FLAT,
      discountValue: 50,
      promoCode: "LUNCH50",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    {
      title: "Family Feast",
      description: "Get 10% off for bills above ₹1500",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      promoCode: "FAMILY10",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    },
  ];

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { promoCode: offer.promoCode },
      update: {
        title: offer.title,
        description: offer.description,
        imageUrl: offer.imageUrl,
        discountType: offer.discountType,
        discountValue: price(offer.discountValue),
        isActive: true,
        startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
      create: {
        title: offer.title,
        description: offer.description,
        imageUrl: offer.imageUrl,
        discountType: offer.discountType,
        discountValue: price(offer.discountValue),
        promoCode: offer.promoCode,
        isActive: true,
        startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const customer = await prisma.customer.upsert({
    where: { phone: "9876543210" },
    update: { name: "Rohit Shinde" },
    create: { name: "Rohit Shinde", phone: "9876543210" },
  });

  const allItems = await prisma.menuItem.findMany({ take: 8 });
  if (allItems.length >= 3) {
    for (let i = 0; i < 6; i += 1) {
      const statusCycle: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELED,
        OrderStatus.READY,
      ];
      const status = statusCycle[i];
      const itemA = allItems[i % allItems.length];
      const itemB = allItems[(i + 1) % allItems.length];

      const quantityA = 1 + (i % 2);
      const quantityB = 1;
      const total = itemA.price.mul(quantityA).add(itemB.price.mul(quantityB));

      const order = await prisma.order.upsert({
        where: { orderNumber: `ORD-10${i + 1}` },
        update: {
          status,
          tableNumber: `T${i + 1}`,
          customerId: customer.id,
          totalAmount: total,
          placedAt: new Date(now.getTime() - i * 3 * 60 * 60 * 1000),
        },
        create: {
          orderNumber: `ORD-10${i + 1}`,
          status,
          tableNumber: `T${i + 1}`,
          customerId: customer.id,
          totalAmount: total,
          placedAt: new Date(now.getTime() - i * 3 * 60 * 60 * 1000),
        },
      });

      await prisma.orderItem.deleteMany({ where: { orderId: order.id } });

      await prisma.orderItem.createMany({
        data: [
          {
            orderId: order.id,
            menuItemId: itemA.id,
            quantity: quantityA,
            unitPrice: itemA.price,
            lineTotal: itemA.price.mul(quantityA),
          },
          {
            orderId: order.id,
            menuItemId: itemB.id,
            quantity: quantityB,
            unitPrice: itemB.price,
            lineTotal: itemB.price.mul(quantityB),
          },
        ],
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

