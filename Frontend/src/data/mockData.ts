import logo from '../assets/Logo.svg';
import loginBg from '../assets/LoginImg.svg';
import dashboardIcon from '../assets/SideBar/DashBoard.svg';
import ordersIcon from '../assets/SideBar/Orders.svg';
import menuItemsIcon from '../assets/SideBar/MenuItems.svg';
import customersIcon from '../assets/SideBar/Customers.svg';
import offersIcon from '../assets/SideBar/Offers.svg';
import billingIcon from '../assets/SideBar/billing.svg';
import usersIcon from '../assets/SideBar/Users.svg';
// NOTE: Categories icon import removed — Categories is not part of the
// reference dashboard sidebar anymore.
import todaysOrdersIcon from '../assets/DashBoard/TodaysOrder.svg';
import revenueIcon from '../assets/DashBoard/Revenue.svg';
import pendingOrdersIcon from '../assets/DashBoard/PendingOders.svg';
import totalCustomersIcon from '../assets/DashBoard/totalCustomer.svg';
import weekendOffer from '../assets/DashBoard/Weekend.svg';
import lunchOffer from '../assets/DashBoard/LunchCombo.svg';
import familyOffer from '../assets/DashBoard/Family.svg';
import happyHourOffer from '../assets/DashBoard/HappyHour.svg';
import type { OfferCard, OrderCard, SidebarItem, StatCard } from '../types/ui';

export const brandAssets = {
  logo,
  loginBg,
};

export const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
  { id: 'orders', label: 'Orders', icon: ordersIcon },
  { id: 'menu-items', label: 'Menu Items', icon: menuItemsIcon },
  { id: 'offers', label: 'Offers', icon: offersIcon },
  { id: 'customers', label: 'Customers', icon: customersIcon },
  { id: 'billing', label: 'Billing', icon: billingIcon },
  { id: 'users', label: 'Users', icon: usersIcon },
];

export const statCards: StatCard[] = [
  {
    title: "Today's Orders",
    value: '20',
    note: '10 completed',
    tone: 'success',
    icon: todaysOrdersIcon,
  },
  {
    title: "Today's Revenue",
    value: '₹ 6,000',
    note: '+12.5%',
    tone: 'success',
    icon: revenueIcon,
  },
  {
    title: 'Pending Orders',
    value: '20',
    note: 'Needs attention',
    tone: 'danger',
    icon: pendingOrdersIcon,
  },
  {
    title: 'Total Customers',
    value: '100',
    note: 'Active users',
    tone: 'primary',
    icon: totalCustomersIcon,
  },
];

export const offers: OfferCard[] = [
  {
    title: 'Weekend Special',
    subtitle: 'Enjoy 20% off on all meal combos.',
    discount: '20% OFF',
    image: weekendOffer,
  },
  {
    title: 'Lunch Combo Deal',
    subtitle: 'Get any main + side + drink.',
    discount: '15% OFF',
    image: lunchOffer,
  },
  {
    title: 'Family Feast',
    subtitle: 'Get 10% off for groups of 4+.',
    discount: '10% OFF',
    image: familyOffer,
  },
  {
    title: 'Happy Hour - Buy 1',
    subtitle: 'Buy one appetizer and get one free.',
    discount: '50% OFF',
    image: happyHourOffer,
  },
];

export const revenuePoints = [4200, 4400, 3900, 2000, 2600, 12000, 1800];

export const popularItems = [
  { name: 'Paneer Lababdar', score: 46 },
  { name: 'Kaju Curry', score: 44 },
  { name: 'Masala Tikka', score: 41 },
  { name: 'Chilly Corn', score: 45 },
  { name: 'Ice Cream', score: 47 },
];

export const orders: OrderCard[] = [
  {
    id: 'ORD-1003',
    customer: 'Rohit Sharma',
    table: 'Table 12',
    status: 'Preparing',
    total: 'INR 100',
    createdAt: '4/15/2026, 4:54:00 PM',
    updatedAt: '4/15/2026, 4:58:00 PM',
    items: [
      { name: '1x Spring Roll', price: 'INR 350' },
      { name: '1x Sweet and Sour Pork', price: 'INR 550' },
      { name: '2x Jasmine Tea', price: 'INR 200' },
    ],
  },
  {
    id: 'ORD-1004',
    customer: 'Rohit Sharma',
    table: 'Table 14',
    status: 'Completed',
    total: 'INR 100',
    createdAt: '4/15/2026, 4:50:00 PM',
    updatedAt: '4/15/2026, 4:53:00 PM',
    items: [
      { name: '1x Spring Roll', price: 'INR 350' },
      { name: '1x Sweet and Sour Pork', price: 'INR 550' },
      { name: '2x Jasmine Tea', price: 'INR 200' },
    ],
  },
  {
    id: 'ORD-1002',
    customer: 'Rohit Sharma',
    table: 'Table 14',
    status: 'Ready',
    total: 'INR 100',
    createdAt: '4/15/2026, 4:50:00 PM',
    updatedAt: '4/15/2026, 4:53:00 PM',
    items: [
      { name: '1x Spring Roll', price: 'INR 350' },
      { name: '1x Sweet and Sour Pork', price: 'INR 550' },
      { name: '2x Jasmine Tea', price: 'INR 200' },
    ],
  },
  {
    id: 'ORD-1001',
    customer: 'Rohit Sharma',
    table: 'Table 15',
    status: 'Ready',
    total: 'INR 100',
    createdAt: '4/15/2026, 4:50:00 PM',
    updatedAt: '4/15/2026, 4:53:00 PM',
    items: [
      { name: '1x Spring Roll', price: 'INR 350' },
      { name: '1x Sweet and Sour Pork', price: 'INR 550' },
      { name: '2x Jasmine Tea', price: 'INR 200' },
    ],
  },
];
