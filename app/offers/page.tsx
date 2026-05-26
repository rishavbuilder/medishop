'use client';

import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import MedicineCard from '@/components/medicine-card';
import { Medicine } from '@/lib/data';
import { fetchMedicines, toMedicine } from '@/lib/supabase';
import Link from 'next/link';

const OFFERS = [
  { code: 'SAVE10', desc: '10% off on orders above ₹500', color: 'from-green-600 to-teal-600' },
  { code: 'FIRST20', desc: '20% off on your first order', color: 'from-blue-600 to-teal-500' },
  { code: 'VITAMIN15', desc: '15% off on all Vitamins & Supplements', color: 'from-orange-500 to-yellow-500' },
];

export default function OffersPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMedicines();
        setMedicines(data.map(toMedicine));
      } catch {
        setError('Failed to load medicines.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const discountedMedicines = medicines.filter(m => m.discount_percent >= 5);
  const displayMedicines = discountedMedicines.length > 0 ? discountedMedicines : medicines;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-10 px-4 text-center text-white">
        <Tag size={32} className="mx-auto mb-3 opacity-80" />
        <h1 className="text-3xl font-bold mb-2">Today's Best Offers</h1>
        <p className="text-white/80">Save more on essential medicines and health products</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Coupon Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {OFFERS.map(({ code, desc, color }) => (
            <div key={code} className={`bg-gradient-to-r ${color} rounded-2xl p-5 text-white`}>
              <p className="text-2xl font-bold mb-1">{code}</p>
              <p className="text-white/80 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="text-center py-12">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-green-600" />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
              {discountedMedicines.length > 0 ? 'Discounted Medicines' : 'Popular Medicines'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayMedicines.map(m => <MedicineCard key={m.id} medicine={m} />)}
            </div>
          </>
        )}

        <div className="text-center mt-10">
          <Link href="/medicines" className="btn-primary inline-flex items-center gap-2">
            Browse All Medicines <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
