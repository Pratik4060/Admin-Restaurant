import { Prisma, OrderStatus } from "@prisma/client";
import { BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";

const toNumber = (value: Prisma.Decimal | number): number =>
  typeof value === "number" ? value : Number(value.toString());

const buildOrderNumber = (): string => {
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${serial}`;
};

type ListOrdersParams = {
  status?: OrderStatus;
  search?: string;
  page: number;
  limit: number;
};

export const listOrders = async ({ status, search, page, limit }: ListOrdersParams) => {
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { customer: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    items: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      status: order.status,
      totalAmount: toNumber(order.totalAmount),
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: order.customer
        ? {
            id: order.customer.id,
            name: order.customer.name,
            phone: order.customer.phone,
          }
        : null,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: toNumber(item.unitPrice),
        lineTotal: toNumber(item.lineTotal),
      })),
    })),
  };
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", NOT_FOUND);
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    tableNumber: order.tableNumber,
    status: order.status,
    notes: order.notes,
    totalAmount: toNumber(order.totalAmount),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer: order.customer
      ? {
          id: order.customer.id,
          name: order.customer.name,
          phone: order.customer.phone,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      name: item.menuItem.name,
      quantity: item.quantity,
      unitPrice: toNumber(item.unitPrice),
      lineTotal: toNumber(item.lineTotal),
    })),
  };
};

type CreateOrderPayload = {
  tableNumber: string;
  customerId?: string;
  notes?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const menuItemIds = payload.items.map((item) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, isAvailable: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    throw new AppError("One or more menu items are invalid or unavailable", BAD_REQUEST);
  }

  const itemMap = new Map(menuItems.map((item) => [item.id, item]));

  const computedItems = payload.items.map((item) => {
    const menuItem = itemMap.get(item.menuItemId)!;
    const lineTotal = menuItem.price.mul(item.quantity);
    return {
      ...item,
      unitPrice: menuItem.price,
      lineTotal,
    };
  });

  const total = computedItems.reduce(
    (sum, item) => sum.add(item.lineTotal),
    new Prisma.Decimal(0),
  );

  const order = await prisma.order.create({
    data: {
      orderNumber: buildOrderNumber(),
      tableNumber: payload.tableNumber,
      notes: payload.notes,
      customerId: payload.customerId,
      totalAmount: total,
      items: {
        create: computedItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      },
    },
  });

  return getOrderById(order.id);
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Order not found", NOT_FOUND);
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return {
    id: updated.id,
    orderNumber: updated.orderNumber,
    status: updated.status,
    updatedAt: updated.updatedAt,
  };
};

