export type AppRoute = 'login' | 'dashboard' | 'orders';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface StatCard {
  title: string;
  value: string;
  note: string;
  tone: 'success' | 'danger' | 'primary';
  icon: string;
}

export interface OfferCard {
  title: string;
  subtitle: string;
  discount: string;
  image: string;
}

export interface OrderItem {
  name: string;
  price: string;
}

export interface OrderCard {
  id: string;
  customer: string;
  table: string;
  status: 'Preparing' | 'Completed' | 'Ready';
  total: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

