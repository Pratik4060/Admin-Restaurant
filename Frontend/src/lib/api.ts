const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const AUTH_TOKEN_KEY = 'restaurant-admin-token';

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown;
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type DashboardSummary = {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  activeUsers: number;
};

export type RevenueTrendPoint = {
  date: string;
  revenue: number;
};

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELED';

export type OrdersResponse = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: Array<{
    id: string;
    orderNumber: string;
    tableNumber: string;
    status: OrderStatus;
    totalAmount: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    customer: { id: string; name: string; phone: string | null } | null;
    items: Array<{
      id: string;
      menuItemId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  }>;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(init.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

export async function login(email: string, password: string) {
  return request<{ token: string; admin: { id: string; name: string; email: string; role: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getDashboardSummary() {
  return request<DashboardSummary>('/dashboard/summary');
}

export async function getRevenueTrend(days = 7) {
  return request<RevenueTrendPoint[]>(`/dashboard/revenue-trend?days=${days}`);
}

export type OrderStatusBreakdownItem = { status: OrderStatus; count: number };

export async function getOrderStatusBreakdown() {
  return request<OrderStatusBreakdownItem[]>('/dashboard/order-status');
}

export async function getActiveOffers() {
  return request<
    Array<{
      id: string;
      title: string;
      description: string | null;
      discountValue: number;
      imageUrl: string;
      discountType: string;
    }>
  >(
    '/dashboard/active-offers',
  );
}

export type PopularItem = {
  id: string;
  name: string;
  likes: number;
  foodType: 'VEG' | 'NON_VEG';
  price: number;
  category: string;
};

export async function getPopularItems(foodType: 'all' | 'veg' | 'nonveg' = 'all', limit = 8) {
  const queryFoodType = foodType === 'nonveg' ? 'nonveg' : foodType;
  return request<PopularItem[]>(`/dashboard/popular-items?foodType=${queryFoodType}&limit=${limit}`);
}

export async function getOrders(search = '') {
  const params = new URLSearchParams({ page: '1', limit: '20' });
  if (search.trim()) params.set('search', search.trim());
  return request<OrdersResponse>(`/orders?${params.toString()}`);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return request<{ id: string; orderNumber: string; status: OrderStatus; updatedAt: string }>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
