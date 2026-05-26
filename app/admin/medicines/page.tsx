'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, X, Check, Loader, AlertCircle } from 'lucide-react';
import { Medicine, Category, getStock, needsPrescription, getCategoryName } from '@/lib/data';
import { fetchMedicines, fetchCategories, toMedicine, toCategory, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm: Partial<Medicine> = {
    name: '', generic_name: '', brand: '', category_id: '', description: '',
    price: 0, mrp: 0, discount_percent: 0, stock_quantity: 0,
    unit: 'strip', image_url: '', requires_prescription: false,
    manufacturer: '', composition: '', uses: '', side_effects: '',
    category: '', stock: 0, rating: null, featured: false, availability: 'In Stock', prescription_required: false,
  };
  const [form, setForm] = useState<Partial<Medicine>>(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [medsData, catsData] = await Promise.all([fetchMedicines(), fetchCategories()]);
      setMedicines(medsData.map(toMedicine));
      setCategories(catsData.map(toCategory));
      setError(null);
    } catch {
      setError('Failed to load medicines.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingMedicine(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (m: Medicine) => { setEditingMedicine(m); setForm({ ...m }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      if (editingMedicine) {
        const { error } = await supabase
          .from('medicines')
          .update({
            name: form.name,
            generic_name: form.generic_name || '',
            brand: form.brand || '',
            description: form.description || '',
            price: form.price ?? 0,
            mrp: form.mrp ?? form.price ?? 0,
            discount_percent: form.discount_percent ?? 0,
            stock_quantity: form.stock ?? form.stock_quantity ?? 0,
            stock: form.stock ?? form.stock_quantity ?? 0,
            unit: form.unit || 'strip',
            image_url: form.image_url || '',
            requires_prescription: form.prescription_required ?? form.requires_prescription ?? false,
            prescription_required: form.prescription_required ?? form.requires_prescription ?? false,
            manufacturer: form.manufacturer || '',
            composition: form.composition || '',
            uses: form.uses || '',
            side_effects: form.side_effects || '',
            category: form.category || '',
            rating: form.rating ?? null,
            featured: form.featured ?? false,
            availability: form.availability || 'In Stock',
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMedicine.id);
        if (error) throw error;
        toast.success('Medicine updated');
      } else {
        const { error } = await supabase
          .from('medicines')
          .insert({
            name: form.name,
            generic_name: form.generic_name || '',
            brand: form.brand || '',
            description: form.description || '',
            price: form.price ?? 0,
            mrp: form.mrp ?? form.price ?? 0,
            discount_percent: form.discount_percent ?? 0,
            stock_quantity: form.stock ?? form.stock_quantity ?? 0,
            stock: form.stock ?? form.stock_quantity ?? 0,
            unit: form.unit || 'strip',
            image_url: form.image_url || '',
            requires_prescription: form.prescription_required ?? form.requires_prescription ?? false,
            is_active: true,
            prescription_required: form.prescription_required ?? form.requires_prescription ?? false,
            manufacturer: form.manufacturer || '',
            composition: form.composition || '',
            uses: form.uses || '',
            side_effects: form.side_effects || '',
            category: form.category || '',
            rating: form.rating ?? null,
            featured: form.featured ?? false,
            availability: form.availability || 'In Stock',
          });
        if (error) throw error;
        toast.success('Medicine added');
      }
      setShowForm(false);
      await loadData();
    } catch {
      toast.error('Failed to save medicine.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('medicines').delete().eq('id', id);
      if (error) throw error;
      setMedicines(ms => ms.filter(m => m.id !== id));
      toast.success('Medicine removed');
    } catch {
      toast.error('Failed to delete medicine.');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center h-64">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button onClick={loadData} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medicines</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{medicines.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search medicines..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Medicine</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Price</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map(m => {
                const stock = getStock(m);
                const catName = getCategoryName(m);
                const stockStatus = stock === 0 ? 'out' : stock <= 10 ? 'low' : 'ok';
                return (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={m.image_url} alt={m.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{catName || '—'}</td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">₹{m.price}</p>
                      {m.discount_percent > 0 && <p className="text-xs text-green-600">{m.discount_percent}% off</p>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-sm font-semibold ${
                        stockStatus === 'out' ? 'text-red-600 dark:text-red-400' :
                        stockStatus === 'low' ? 'text-orange-600 dark:text-orange-400' :
                        'text-gray-900 dark:text-white'
                      }`}>
                        {stock}
                        {stockStatus === 'low' && <AlertTriangle size={12} className="inline ml-1" />}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={stockStatus === 'out' ? 'badge-red' : stockStatus === 'low' ? 'badge-yellow' : 'badge-green'}>
                        {stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(m)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteId(m.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Medicine Name *', key: 'name', type: 'text', placeholder: 'e.g. Paracetamol 500mg' },
                { label: 'Generic Name', key: 'generic_name', type: 'text', placeholder: 'Active ingredient' },
                { label: 'Brand', key: 'brand', type: 'text', placeholder: 'Brand name' },
                { label: 'Manufacturer', key: 'manufacturer', type: 'text', placeholder: 'Company name' },
                { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '0.00' },
                { label: 'MRP (₹)', key: 'mrp', type: 'number', placeholder: '0.00' },
                { label: 'Discount %', key: 'discount_percent', type: 'number', placeholder: '0' },
                { label: 'Stock Quantity', key: 'stock', type: 'number', placeholder: '0' },
                { label: 'Unit/Pack Size', key: 'unit', type: 'text', placeholder: 'strip of 10 tablets' },
                { label: 'Image URL', key: 'image_url', type: 'url', placeholder: 'https://...' },
                { label: 'Category Text', key: 'category', type: 'text', placeholder: 'e.g. Fever & Pain, Vitamins' },
                { label: 'Rating', key: 'rating', type: 'number', placeholder: '4.5' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(form[key as keyof typeof form] as string | number | null) ?? ''}
                    onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? (e.target.value ? parseFloat(e.target.value) : null) : e.target.value }))}
                    placeholder={placeholder}
                    className="input-field text-sm py-2.5"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Availability</label>
                <select
                  value={form.availability ?? 'In Stock'}
                  onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}
                  className="input-field text-sm py-2.5"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rx"
                    checked={form.prescription_required ?? form.requires_prescription ?? false}
                    onChange={e => setForm(f => ({ ...f, prescription_required: e.target.checked, requires_prescription: e.target.checked }))}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label htmlFor="rx" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Rx Required</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured ?? false}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Featured</label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="input-field text-sm py-2.5 resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Composition</label>
                <input
                  type="text"
                  value={form.composition ?? ''}
                  onChange={e => setForm(f => ({ ...f, composition: e.target.value }))}
                  className="input-field text-sm py-2.5"
                  placeholder="Active ingredients and strengths..."
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> {editingMedicine ? 'Save Changes' : 'Add Medicine'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Delete Medicine?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
