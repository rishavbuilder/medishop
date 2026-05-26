export type Medicine = {
  id: string;
  name: string;
  generic_name: string;
  brand: string;
  category_id: string | null;
  description: string;
  price: number;
  mrp: number;
  discount_percent: number;
  stock_quantity: number;
  unit: string;
  image_url: string;
  requires_prescription: boolean;
  is_active: boolean;
  expiry_date: string | null;
  manufacturer: string;
  composition: string;
  uses: string;
  side_effects: string;
  created_at: string;
  updated_at: string;
  // Additional columns from DB
  category: string | null;
  stock: number | null;
  rating: number | null;
  featured: boolean | null;
  availability: string | null;
  prescription_required: boolean | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image_url: string;
};

export type CartItem = {
  id: string;
  medicine: Medicine;
  quantity: number;
};

// Effective stock: prefer `stock` column, fall back to `stock_quantity`
export function getStock(m: Medicine): number {
  return m.stock ?? m.stock_quantity;
}

// Effective prescription requirement: prefer `prescription_required`, fall back to `requires_prescription`
export function needsPrescription(m: Medicine): boolean {
  return m.prescription_required ?? m.requires_prescription;
}

// Effective category name: prefer `category` text column, fall back to lookup
export function getCategoryName(m: Medicine): string {
  return m.category || '';
}

// Effective availability status
export function getAvailability(m: Medicine): string {
  const stock = getStock(m);
  if (stock === 0) return 'Out of Stock';
  return m.availability || (stock <= 10 ? 'Low Stock' : 'In Stock');
}

export const WHATSAPP_PHONE = '+919999999999';

export function generateWhatsAppMessage(items: CartItem[], customerName?: string): string {
  const header = `*New Order from MediShop*\n${customerName ? `Customer: ${customerName}\n` : ''}`;
  const itemsList = items.map(item =>
    `• ${item.medicine.name} x${item.quantity} = ₹${(item.medicine.price * item.quantity).toFixed(2)}`
  ).join('\n');
  const total = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  return `${header}\n${itemsList}\n\n*Total: ₹${total.toFixed(2)}*\n\nPlease confirm my order.`;
}

export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_PHONE.replace('+', '')}?text=${encoded}`, '_blank');
}

export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  shipped: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
