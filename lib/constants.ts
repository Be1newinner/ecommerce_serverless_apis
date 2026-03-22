// Product Status Options
export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
] as const;

// Order Status Options
export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
] as const;

// Payment Status Options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
] as const;

// Customer Status Options
export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'inactive', label: 'Inactive' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
] as const;

// Attribute Types
export const ATTRIBUTE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'select', label: 'Select' },
  { value: 'color', label: 'Color' },
  { value: 'size', label: 'Size' },
] as const;

// User Roles
export const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'catalog_manager', label: 'Catalog Manager' },
  { value: 'order_manager', label: 'Order Manager' },
] as const;

// Address Types
export const ADDRESS_TYPES = [
  { value: 'billing', label: 'Billing Address' },
  { value: 'shipping', label: 'Shipping Address' },
] as const;

// Navigation Items
export const ADMIN_MENU_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'BarChart3' },
  {
    label: 'Catalog',
    icon: 'Package',
    submenu: [
      { label: 'Products', href: '/admin/products' },
      { label: 'Categories', href: '/admin/categories' },
      { label: 'Attributes', href: '/admin/attributes' },
    ],
  },
  {
    label: 'Orders & Sales',
    icon: 'ShoppingCart',
    submenu: [
      { label: 'Orders', href: '/admin/orders' },
      { label: 'Payments', href: '/admin/payments' },
    ],
  },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  {
    label: 'Settings',
    icon: 'Settings',
    submenu: [
      { label: 'Shiprocket', href: '/admin/settings/shiprocket' },
      { label: 'Checkout', href: '/admin/settings/checkout' },
      { label: 'Users', href: '/admin/settings/users' },
    ],
  },
] as const;

// Stock Status
export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
} as const;

// Low Stock Threshold
export const LOW_STOCK_THRESHOLD = 10;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Currency
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Tax Calculation
export const DEFAULT_TAX_RATE = 18; // 18% GST for India

// Shipping
export const CARRIERS = [
  { value: 'delhivery', label: 'Delhivery' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'bluedart', label: 'Blue Dart' },
  { value: 'ecom', label: 'ECOM Express' },
] as const;
