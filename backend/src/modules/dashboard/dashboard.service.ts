import { FoodType, OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const toNumber = (value: Prisma.Decimal | number): number =>
  typeof value === "number" ? value : Number(value.toString());

export const getSummary = async () => {
  const [todayOrders, pendingOrders, totalCustomers, todayRevenueAgg] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.count({
      where: { status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING] } },
    }),
    prisma.customer.count(),
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        status: { not: OrderStatus.CANCELED },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  const activeUsers = await prisma.customer.count({
    where: {
      orders: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  return {
    todayOrders,
    todayRevenue: toNumber(todayRevenueAgg._sum.totalAmount ?? 0),
    pendingOrders,
    totalCustomers,
    activeUsers,
  };
};

export const getRevenueTrend = async (days: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: { not: OrderStatus.CANCELED },
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const dayTotals = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    dayTotals.set(day.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    dayTotals.set(key, (dayTotals.get(key) ?? 0) + toNumber(order.totalAmount));
  }

  return Array.from(dayTotals.entries()).map(([date, revenue]) => ({
    date,
    revenue: Number(revenue.toFixed(2)),
  }));
};

export const getOrderStatusBreakdown = async () => {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const defaultStatuses = Object.values(OrderStatus).map((status) => ({
    status,
    count: 0,
  }));

  return defaultStatuses.map((defaultRow) => {
    const found = grouped.find((item) => item.status === defaultRow.status);
    return {
      status: defaultRow.status,
      count: found?._count.status ?? 0,
    };
  });
};

export const getActiveOffers = async () => {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return offers.map((offer) => ({
    ...offer,
    discountValue: toNumber(offer.discountValue),
  }));
};

export const getPopularItems = async (foodType: "all" | "veg" | "nonveg", limit: number) => {
  const items = await prisma.menuItem.findMany({
    where:
      foodType === "all"
        ? {}
        : {
            foodType: foodType === "veg" ? FoodType.VEG : FoodType.NON_VEG,
          },
    orderBy: [{ likes: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      category: true,
    },
  });

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    likes: item.likes,
    foodType: item.foodType,
    price: toNumber(item.price),
    category: item.category.name,
  }));
};

