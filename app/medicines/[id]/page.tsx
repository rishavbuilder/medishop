'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart, MessageCircle, Check, AlertCircle,
  FileText, Package, Info, Shield, Star, Plus, Minus, Share2, Loader
} from 'lucide-react';
import { Medicine, generateWhatsAppMessage, openWhatsApp, getStock, needsPrescription, getCategoryName, getAvailability } from '@/lib/data';
import { fetchMedicineById, fetchMedicines, toMedicine } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';
import MedicineCard from '@/components/medicine-card';
import { toast } from 'sonner';

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, items, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'overview' | 'composition' | 'uses'>('overview');

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [related, setRelated] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const medData = await fetchMedicineById(params.id as string);
        if (!medData) {
          setError('Medicine not found');
          setLoading(false);
          return;
        }
        const med = toMedicine(medData);
        setMedicine(med);

        // Fetch related medicines (same category)
        const allMeds = await fetchMedicines();
        const allConverted = allMeds.map(toMedicine).filter(m => m.id !== med.id);
        const relatedMeds = med.category
          ? allConverted.filter(m => m.category === med.category).slice(0, 4)
          : allConverted.slice(0, 4);
        setRelated(relatedMeds);
      } catch {
        setError('Failed to load medicine details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <AlertCircle size={40} className="text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{error || 'Medicine not found'}</h2>
        <Link href="/medicines" className="btn-primary">Browse Medicines</Link>
      </div>
    );
  }

  const stock = getStock(medicine);
  const rx = needsPrescription(medicine);
  const outOfStock = stock === 0;
  const savings = ((medicine.mrp - medicine.price) * qty).toFixed(2);
  const availability = getAvailability(medicine);
  const cartItem = items.find(i => i.medicine.id === medicine.id);
  const categoryName = getCategoryName(medicine);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(medicine);
    if (cartItem) {
      updateQuantity(medicine.id, cartItem.quantity + qty - 1);
    } else {
      for (let i = 1; i < qty; i++) addItem(medicine);
    }
    toast.success(`${medicine.name} added to cart`);
  };

  const handleBuyWhatsApp = () => {
    const msg = generateWhatsAppMessage([{ id: medicine.id, medicine, quantity: qty }]);
    openWhatsApp(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/medicines" className="hover:text-green-600 transition-colors">Medicines</Link>
          {categoryName && (
            <>
              <span>/</span>
              <span className="hover:text-green-600 transition-colors">{categoryName}</span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{medicine.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
              <div className="relative aspect-square">
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  className="w-full h-full object-cover"
                />
                {medicine.discount_percent > 0 && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    {medicine.discount_percent}% OFF
                  </div>
                )}
                {rx && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <FileText size={12} /> Prescription Required
                  </div>
                )}
                {medicine.featured && (
                  <div className="absolute top-4 left-4 mt-10 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 size={16} /> Share Product
            </button>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  {categoryName && (
                    <span className="inline-block text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full mb-2">
                      {categoryName}
                    </span>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{medicine.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{medicine.generic_name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">by {medicine.brand} · {medicine.unit}</p>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                {medicine.rating ? (
                  <>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} className={i <= Math.round(medicine.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{medicine.rating}</span>
                  </>
                ) : (
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">4.8</span>
                  </div>
                )}
                <span className="text-sm text-gray-400">(reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{(medicine.price * qty).toFixed(2)}</span>
                  {medicine.mrp > medicine.price && (
                    <span className="text-lg text-gray-400 line-through">₹{(medicine.mrp * qty).toFixed(2)}</span>
                  )}
                </div>
                {parseFloat(savings) > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                    You save ₹{savings} ({medicine.discount_percent}% off)
                  </p>
                )}
              </div>

              {/* Stock status */}
              <div className={`flex items-center gap-2 mb-5 text-sm font-medium ${
                outOfStock ? 'text-red-600 dark:text-red-400' :
                stock <= 10 ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {outOfStock ? <><AlertCircle size={15} /> Out of Stock</> :
                  stock <= 10 ? <><AlertCircle size={15} /> Only {stock} left in stock!</> :
                  <><Check size={15} /> {availability}</>
                }
              </div>

              {/* Quantity */}
              {!outOfStock && (
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</span>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(stock, q + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mb-5">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    outOfStock
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  <ShoppingCart size={18} /> {cartItem ? 'Add More to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyWhatsApp}
                  className="btn-whatsapp w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> Order via WhatsApp
                </button>
                {cartItem && (
                  <Link href="/cart" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                    View Cart ({cartItem.quantity} item{cartItem.quantity > 1 ? 's' : ''})
                  </Link>
                )}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                {[
                  { icon: Shield, label: 'Genuine', desc: '100% authentic' },
                  { icon: Package, label: 'Safe Pack', desc: 'Secure delivery' },
                  { icon: Info, label: 'Certified', desc: 'Govt. approved' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <Icon size={18} className="text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-12 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {(['overview', 'composition', 'uses'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t === 'overview' ? 'Overview' : t === 'composition' ? 'Composition' : 'Uses & Side Effects'}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'overview' && (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{medicine.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Brand', value: medicine.brand || '-' },
                    { label: 'Manufacturer', value: medicine.manufacturer || '-' },
                    { label: 'Pack Size', value: medicine.unit },
                    { label: 'Category', value: categoryName || '-' },
                    { label: 'Prescription', value: rx ? 'Required' : 'Not required' },
                    { label: 'Availability', value: availability },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'composition' && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Active Ingredients</h3>
                {medicine.composition ? (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                    <p className="text-gray-700 dark:text-gray-300">{medicine.composition}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Composition details not available.</p>
                )}
              </div>
            )}
            {tab === 'uses' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Uses & Indications</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{medicine.uses || 'Information not available.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Side Effects</h3>
                  {medicine.side_effects ? (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                      <p className="text-gray-700 dark:text-gray-300">{medicine.side_effects}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Side effects information not available.</p>
                  )}
                </div>
                {rx && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 flex gap-3">
                    <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      This medicine requires a valid prescription from a licensed medical practitioner. Please upload your prescription or consult your doctor before ordering.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Medicines */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Similar Medicines</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(m => <MedicineCard key={m.id} medicine={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
