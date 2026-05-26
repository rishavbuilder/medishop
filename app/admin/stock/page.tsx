'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Plus, Check, Loader, AlertCircle } from 'lucide-react';
import { Medicine, getStock, getCategoryName } from '@/lib/data';
import { fetchMedicines, toMedicine, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminStockPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [addQty, setAddQty] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await fetchMedicines();
      setMedicines(data.map(toMedicine));
      setError(null);
    } catch {
      setError('Failed to load medicines.');
    } finally {
      setLoading(false);
    }
  }

  const lowStock = medicines.filter(m => getStock(m) > 0 && getStock(m) <= 10);
  const outOfStock = medicines.filter(m => getStock(m) === 0);
  const healthyStock = medicines.filter(m => getStock(m) > 10);

  const handleAddStock = async (id: string) => {
    const qty = addQty[id] || 0;
    if (qty <= 0) { toast.error('Enter a valid quantity'); return; }
    const med = medicines.find(m => m.id === id);
    if (!med) return;
    const newStock = getStock(med) + qty;
    setSaving(id);
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ stock: newStock, stock_quantity: newStock, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setMedicines(ms => ms.map(m => m.id === id ? { ...m, stock: newStock, stock_quantity: newStock } : m));
      setAddQty(q => ({ ...q, [id]: 0 }));
      toast.success('Stock updated successfully');
    } catch {
      toast.error('Failed to update stock.');
    } finally {
      setSaving(null);
      setUpdating(null);
    }
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

  const StockRow = ({ m, variant }: { m: Medicine; variant: 'danger' | 'warning' | 'normal' }) => {
    const stock = getStock(m);
    const catName = getCategoryName(m);
    return (
      <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
        variant === 'danger' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' :
        variant === 'warning' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20' :
        'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
      }`}>
        <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{m.brand} · {m.unit} {catName && `· ${catName}`}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={`text-right mr-2 ${
            variant === 'danger' ? 'text-red-600 dark:text-red-400' :
            variant === 'warning' ? 'text-orange-600 dark:text-orange-400' :
            'text-gray-900 dark:text-white'
          }`}>
            <p className="font-bold text-lg leading-none">{stock}</p>
            <p className="text-xs">units</p>
          </div>
          {updating === m.id ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={addQty[m.id] || ''}
                onChange={e => setAddQty(q => ({ ...q, [m.id]: parseInt(e.target.value) || 0 }))}
                placeholder="Add qty"
                className="w-20 px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800"
                autoFocus
              />
              <button onClick={() => handleAddStock(m.id)} disabled={saving === m.id} className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                {saving === m.id ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
              </button>
              <button onClick={() => setUpdating(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setUpdating(m.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 transition-all"
            >
              <Plus size={14} /> Update
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and update medicine inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{outOfStock.length}</p>
          <p className="text-sm font-medium text-red-800 dark:text-red-300 mt-1">Out of Stock</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{lowStock.length}</p>
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mt-1">Low Stock</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{healthyStock.length}</p>
          <p className="text-sm font-medium text-green-800 dark:text-green-300 mt-1">Healthy Stock</p>
        </div>
      </div>

      {/* Out of Stock */}
      {outOfStock.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" /> Out of Stock ({outOfStock.length})
          </h2>
          <div className="space-y-2">
            {outOfStock.map(m => <StockRow key={m.id} m={m} variant="danger" />)}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" /> Low Stock ({lowStock.length})
          </h2>
          <div className="space-y-2">
            {lowStock.map(m => <StockRow key={m.id} m={m} variant="warning" />)}
          </div>
        </div>
      )}

      {/* All Medicines */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Package size={18} className="text-green-600" /> All Medicines
        </h2>
        <div className="space-y-2">
          {medicines.map(m => <StockRow key={m.id} m={m} variant="normal" />)}
        </div>
      </div>
    </div>
  );
}
