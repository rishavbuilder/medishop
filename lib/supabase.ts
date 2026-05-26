import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type MedicineRow = {
  id: string;
  name: string;
  generic_name: string | null;
  brand: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  mrp: number;
  discount_percent: number | null;
  stock_quantity: number;
  unit: string | null;
  image_url: string | null;
  requires_prescription: boolean | null;
  is_active: boolean | null;
  expiry_date: string | null;
  manufacturer: string | null;
  composition: string | null;
  uses: string | null;
  side_effects: string | null;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
  stock: number | null;
  rating: number | null;
  featured: boolean | null;
  availability: string | null;
  prescription_required: boolean | null;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_admin: boolean | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  whatsapp_sent: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  medicine_id: string | null;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string | null;
};

export type PrescriptionRow = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  file_url: string;
  file_type: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CartItemRow = {
  id: string;
  user_id: string | null;
  medicine_id: string | null;
  quantity: number;
  created_at: string | null;
  updated_at: string | null;
};

// Helper: fetch all active medicines
export async function fetchMedicines() {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as MedicineRow[]) || [];
}

// Helper: fetch featured medicines
export async function fetchFeaturedMedicines() {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('is_active', true)
    .eq('featured', true)
    .order('rating', { ascending: false });

  if (error) throw error;
  return (data as MedicineRow[]) || [];
}

// Helper: fetch single medicine by id
export async function fetchMedicineById(id: string) {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as MedicineRow | null;
}

// Helper: search medicines
export async function searchMedicines(query: string) {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,generic_name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('rating', { ascending: false });

  if (error) throw error;
  return (data as MedicineRow[]) || [];
}

// Helper: fetch all categories
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data as CategoryRow[]) || [];
}

// Convert a MedicineRow from DB to the app's Medicine type
export function toMedicine(row: MedicineRow): import('./data').Medicine {
  return {
    id: row.id,
    name: row.name,
    generic_name: row.generic_name || '',
    brand: row.brand || '',
    category_id: row.category_id || '',
    description: row.description || '',
    price: Number(row.price) || 0,
    mrp: Number(row.mrp) || 0,
    discount_percent: Number(row.discount_percent) || 0,
    stock_quantity: row.stock_quantity ?? 0,
    unit: row.unit || 'strip',
    image_url: row.image_url || '',
    requires_prescription: row.requires_prescription ?? false,
    is_active: row.is_active ?? true,
    expiry_date: row.expiry_date,
    manufacturer: row.manufacturer || '',
    composition: row.composition || '',
    uses: row.uses || '',
    side_effects: row.side_effects || '',
    created_at: row.created_at || '',
    updated_at: row.updated_at || '',
    category: row.category,
    stock: row.stock,
    rating: row.rating ? Number(row.rating) : null,
    featured: row.featured,
    availability: row.availability,
    prescription_required: row.prescription_required,
  };
}

// Convert CategoryRow to app Category type
export function toCategory(row: CategoryRow): import('./data').Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon || '',
    description: row.description || '',
    image_url: row.image_url || '',
  };
}
