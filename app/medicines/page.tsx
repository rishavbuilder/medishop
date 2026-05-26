'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown, AlertCircle, Loader } from 'lucide-react';
import MedicineCard from '@/components/medicine-card';
import { Medicine, Category, getStock, needsPrescription, getCategoryName } from '@/lib/data';
import { fetchMedicines, fetchCategories, searchMedicines, toMedicine, toCategory } from '@/lib/supabase';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Best Discount' },
];

function SkeletonCard() {
  return (
    <div className="medicine-card">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-5 w-20 skeleton rounded" />
        <div className="flex gap-2">
          <div className="flex-1 h-10 skeleton rounded-xl" />
          <div className="w-10 h-10 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function MedicinesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [rxFilter, setRxFilter] = useState<'all' | 'otc' | 'rx'>('all');

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [medsData, catsData] = await Promise.all([
          fetchMedicines(),
          fetchCategories(),
        ]);
        setMedicines(medsData.map(toMedicine));
        setCategories(catsData.map(toCategory));
      } catch {
        setError('Failed to load medicines. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('category') || '';
    setQuery(q);
    setSelectedCategory(c);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result: Medicine[] = [...medicines];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.category && m.category.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        // Match by category_id OR by the text `category` field
        const catName = cat.name.toLowerCase();
        result = result.filter(m =>
          m.category_id === cat.id ||
          (m.category && m.category.toLowerCase() === catName)
        );
      }
    }

    if (inStockOnly) result = result.filter(m => getStock(m) > 0);

    if (rxFilter === 'otc') result = result.filter(m => !needsPrescription(m));
    if (rxFilter === 'rx') result = result.filter(m => needsPrescription(m));

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'discount': result.sort((a, b) => b.discount_percent - a.discount_percent); break;
      default:
        // popular = by rating descending
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return result;
  }, [query, selectedCategory, sortBy, inStockOnly, rxFilter, medicines, categories]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setInStockOnly(false);
    setRxFilter('all');
    router.push('/medicines');
  };

  const hasFilters = query || selectedCategory || inStockOnly || rxFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-[calc(4rem+28px)] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search medicines, brands, generics..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                hasFilters
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && <span className="w-2 h-2 bg-white rounded-full" />}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Category */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                {/* Prescription */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Type</label>
                  <select
                    value={rxFilter}
                    onChange={e => setRxFilter(e.target.value as 'all' | 'otc' | 'rx')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    <option value="otc">OTC (No Prescription)</option>
                    <option value="rx">Prescription Required</option>
                  </select>
                </div>

                {/* In Stock */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
                </label>

                {hasFilters && (
                  <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                    <X size={14} /> Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${filtered.length} medicine${filtered.length !== 1 ? 's' : ''} found`}
            {selectedCategory && !loading && ` in "${categories.find(c => c.slug === selectedCategory)?.name}"`}
            {query && !loading && ` for "${query}"`}
          </p>
        </div>

        {error ? (
          <div className="text-center py-20">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No medicines found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(m => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <MedicinesContent />
    </Suspense>
  );
}
