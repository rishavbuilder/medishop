'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Pill, ShoppingBag, FileText, AlertTriangle, TrendingUp,
  TrendingDown, Users, DollarSign, Package, ArrowRight, Clock, Loader, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Medicine, getStock, getCategoryName } from '@/lib/data';
import { fetchMedicines, toMedicine } from '@/lib/supabase';
import { STATUS_COLORS, OrderStatus } from '@/lib/data';

const WEEKLY_ORDERS = [
  { day: 'Mon', orders: 12, revenue: 4800 },
  { day: 'Tue', orders: 19, revenue: 7200 },
  { day: 'Wed', orders: 15, revenue: 5900 },
  { day: 'Thu', orders: 24, revenue: 9600 },
  { day: 'Fri', orders: 28, revenue: 11200 },
  { day: 'Sat', orders: 35, revenue: 14000 },
  { day: 'Sun', orders: 22, revenue: 8800 },
];

const CATEGORY_SALES = [
  { name: 'Tablets', value: 45, color: '#16a34a' },
  { name: 'Vitamins', value: 25, color: '#14b8a6' },
  { name: 'Syrups', value: 15, color: '#3b82f6' },
  { name: 'Skincare', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#8b5cf6' },
];

const RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'Priya Sharma', amount: 450, status: 'delivered' as OrderStatus, items: 3, time: '2 hrs ago' },
  { id: 'ORD-002', customer: 'Rajesh Kumar', amount: 1200, status: 'shipped' as OrderStatus, items: 5, time: '3 hrs ago' },
  { id: 'ORD-003', customer: 'Anita Patel', amount: 680, status: 'processing' as OrderStatus, items: 2, time: '4 hrs ago' },
  { id: 'ORD-004', customer: 'Suresh Nair', amount: 290, status: 'confirmed' as OrderStatus, items: 1, time: '5 hrs ago' },
  { id: 'ORD-005', customer: 'Meena Singh', amount: 850, status: 'pending' as OrderStatus, items: 4, time: '6 hrs ago' },
];

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMedicines();
        setMedicines(data.map(toMedicine));
      } catch {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const lowStockMedicines = medicines.filter(m => getStock(m) > 0 && getStock(m) <= 10);
  const outOfStockMedicines = medicines.filter(m => getStock(m) === 0);
  const featuredCount = medicines.filter(m => m.featured).length;
  const avgRating = medicines.length > 0
    ? (medicines.reduce((sum, m) => sum + (m.rating ?? 0), 0) / medicines.length).toFixed(1)
    : '0';

  const STAT_CARDS = [
    { title: 'Total Medicines', value: `${medicines.length}`, change: `${featuredCount} featured`, positive: true, icon: Pill, color: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-600 dark:text-green-400', href: '/admin/medicines' },
    { title: "Today's Orders", value: '28', change: '+12% vs yesterday', positive: true, icon: ShoppingBag, color: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400', href: '/admin/orders' },
    { title: 'Pending Prescriptions', value: '7', change: '2 urgent', positive: false, icon: FileText, color: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-600 dark:text-orange-400', href: '/admin/prescriptions' },
    { title: "Today's Revenue", value: '₹11,200', change: '+8% vs yesterday', positive: true, icon: DollarSign, color: 'bg-teal-50 dark:bg-teal-900/20', iconColor: 'text-teal-600 dark:text-teal-400', href: '/admin/analytics' },
  ];

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
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ title, value, change, positive, icon: Icon, color, iconColor, href }) => (
          <Link key={title} href={href} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={iconColor} />
              </div>
              {positive ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-orange-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
            <p className={`text-xs mt-1 font-medium ${positive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {change}
            </p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Revenue</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Orders and revenue this week</p>
            </div>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEKLY_ORDERS}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#revenueGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sales by Category</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Distribution this month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_SALES} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {CATEGORY_SALES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_SALES.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {RECENT_ORDERS.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {order.customer[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.id} · {order.items} items · {order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹{order.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" /> Stock Alerts
            </h3>
            <Link href="/admin/stock" className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Manage <ArrowRight size={12} />
            </Link>
          </div>

          {outOfStockMedicines.length > 0 && (
            <div className="px-5 py-3 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Out of Stock ({outOfStockMedicines.length})</p>
            </div>
          )}

          <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-72 overflow-y-auto">
            {outOfStockMedicines.map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.brand} {getCategoryName(m) && `· ${getCategoryName(m)}`}</p>
                </div>
                <span className="badge-red">Out of stock</span>
              </div>
            ))}
            {lowStockMedicines.map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.brand} {getCategoryName(m) && `· ${getCategoryName(m)}`}</p>
                </div>
                <span className="badge-yellow">{getStock(m)} left</span>
              </div>
            ))}
            {outOfStockMedicines.length === 0 && lowStockMedicines.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                All stock levels are healthy
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
