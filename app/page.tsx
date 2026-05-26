'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ChevronLeft, ChevronRight, Upload,
  Phone, Star, Shield, Truck, Clock, MessageCircle,
  Pill, Droplet, Sun, Leaf, Baby, Activity, Heart, Zap, Loader, AlertCircle
} from 'lucide-react';
import MedicineCard from '@/components/medicine-card';
import { Medicine, Category } from '@/lib/data';
import { fetchMedicines, fetchCategories, toMedicine, toCategory } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const BANNERS = [
  {
    title: 'Up to 20% off on Vitamins',
    subtitle: 'Stock up on essential supplements this season',
    cta: 'Shop Now',
    href: '/medicines?category=vitamins-supplements',
    bg: 'from-green-600 to-teal-600',
    img: 'https://images.pexels.com/photos/3738370/pexels-photo-3738370.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Diabetes Care Essentials',
    subtitle: 'Manage your health better with our curated diabetes range',
    cta: 'Explore',
    href: '/medicines?category=diabetes-care',
    bg: 'from-blue-600 to-teal-500',
    img: 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Upload Your Prescription',
    subtitle: 'Quick and easy prescription medicine delivery',
    cta: 'Upload Now',
    href: '/prescription',
    bg: 'from-emerald-600 to-green-700',
    img: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  'tablets-capsules': Pill,
  'syrups-liquids': Droplet,
  'vitamins-supplements': Sun,
  'skincare': Heart,
  'baby-care': Baby,
  'diabetes-care': Activity,
  'cardiac-care': Heart,
  'ayurvedic': Leaf,
};

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Excellent service! Got my medicines delivered within 2 hours. Genuine products and great prices.' },
  { name: 'Rajesh Kumar', location: 'Delhi', rating: 5, text: 'The prescription upload feature is very convenient. Pharmacist called back quickly to confirm. Highly recommend!' },
  { name: 'Anita Patel', location: 'Pune', rating: 5, text: 'Best online pharmacy I have used. Clear pricing, fast delivery, and authentic medicines. 5 stars!' },
  { name: 'Suresh Nair', location: 'Chennai', rating: 4, text: 'Good selection of products. The WhatsApp ordering is super convenient. Will definitely order again.' },
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

export default function HomePage() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(i => (i + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [medsData, catsData] = await Promise.all([
          fetchMedicines(),
          fetchCategories(),
        ]);
        setMedicines(medsData.map(toMedicine));
        setCategories(catsData.map(toCategory));
      } catch (err) {
        setError('Failed to load medicines. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/medicines?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredMedicines = medicines.filter(m => m.featured).slice(0, 8);
  const discountedMedicines = medicines.filter(m => m.discount_percent >= 10).slice(0, 6);
  // If no featured/discounted, show all
  const displayFeatured = featuredMedicines.length > 0 ? featuredMedicines : medicines.slice(0, 8);
  const displayDiscounted = discountedMedicines.length > 0 ? discountedMedicines : medicines.slice(0, 6);

  return (
    <div className="pb-4">
      {/* Hero + Banner Slider */}
      <section className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-r ${BANNERS[bannerIndex].bg} transition-all duration-700`}
          style={{ minHeight: '420px' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-white animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-4">
                  <Shield size={14} /> Trusted by 50,000+ customers
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
                  {BANNERS[bannerIndex].title}
                </h1>
                <p className="text-lg text-white/80 mb-6">{BANNERS[bannerIndex].subtitle}</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search medicines, brands..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3.5 bg-white text-green-700 font-semibold rounded-2xl hover:bg-green-50 transition-colors shadow-lg">
                    Search
                  </button>
                </form>

                <div className="flex gap-3 mt-5 flex-wrap">
                  <Link href={BANNERS[bannerIndex].href} className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors shadow-md">
                    {BANNERS[bannerIndex].cta} <ArrowRight size={16} />
                  </Link>
                  <Link href="/prescription" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                    <Upload size={16} /> Upload Prescription
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block flex-1 max-w-md">
                <img
                  src={BANNERS[bannerIndex].img}
                  alt="Banner"
                  className="w-full h-72 object-cover rounded-3xl shadow-2xl opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Slide controls */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`transition-all ${i === bannerIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'} h-2 rounded-full`}
              />
            ))}
          </div>
          <button
            onClick={() => setBannerIndex(i => (i - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setBannerIndex(i => (i + 1) % BANNERS.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Shield, label: '100% Authentic', value: 'Verified Medicines', color: 'text-green-600' },
              { icon: Truck, label: 'Fast Delivery', value: 'Same Day in City', color: 'text-blue-600' },
              { icon: Clock, label: '24/7 Support', value: 'Always Available', color: 'text-orange-600' },
              { icon: Star, label: '4.9 Rating', value: '50K+ Reviews', color: 'text-yellow-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Icon size={24} className={color} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50 dark:bg-gray-950">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find medicines by health condition</p>
            </div>
            <Link href="/medicines" className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 skeleton rounded-2xl" />
                  <div className="h-3 w-16 skeleton rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat.slug] || Pill;
                return (
                  <Link
                    key={cat.id}
                    href={`/medicines?category=${cat.slug}`}
                    className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1 group"
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 group-hover:bg-green-600 rounded-2xl flex items-center justify-center transition-colors">
                      <Icon size={22} className="text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Best Sellers</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most ordered medicines this week</p>
            </div>
            <Link href="/medicines" className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {error ? (
            <div className="text-center py-12">
              <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {displayFeatured.map(m => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prescription Upload Banner */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-3">
                <Upload size={14} /> Upload Prescription
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Have a prescription?</h2>
              <p className="text-white/80 mb-6">
                Upload your prescription and we will prepare your medicines. Our licensed pharmacist will verify and deliver to your door.
              </p>
              <Link href="/prescription" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-md">
                Upload Now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hidden md:flex gap-6">
              {['Upload Photo', 'Expert Review', 'Fast Delivery'].map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-2 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-center">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      {!loading && displayDiscounted.length > 0 && (
        <section className="section-padding bg-white dark:bg-gray-900">
          <div className="container-max">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Offers</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Limited time deals on popular medicines</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayDiscounted.map(m => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Contact */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Need Emergency Medicines?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Call us for urgent medicine delivery. We're available 24/7.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:+919999999999" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md">
                <Phone size={16} /> Call Now
              </a>
              <a
                href="https://wa.me/919999999999?text=I need urgent medicines"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50 dark:bg-gray-950">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-10 text-white shadow-xl">
            <Zap size={40} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold mb-2">Order in 60 Seconds</h2>
            <p className="text-white/80 mb-6">WhatsApp your medicine list and we'll deliver it to your door. Fast, simple, reliable.</p>
            <a
              href="https://wa.me/919999999999?text=Hi, I want to order medicines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg"
            >
              <MessageCircle size={22} /> Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
