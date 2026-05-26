'use client';

import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jul', orders: 180, revenue: 72000 },
  { month: 'Aug', orders: 220, revenue: 88000 },
  { month: 'Sep', orders: 195, revenue: 78000 },
  { month: 'Oct', orders: 260, revenue: 104000 },
  { month: 'Nov', orders: 310, revenue: 124000 },
  { month: 'Dec', orders: 285, revenue: 114000 },
];

const TOP_MEDICINES = [
  { name: 'Dolo 650', sales: 450, revenue: 13725 },
  { name: 'Vitamin D3', sales: 320, revenue: 63680 },
  { name: 'Cetrizine', sales: 280, revenue: 7000 },
  { name: 'Pantoprazole', sales: 210, revenue: 17850 },
  { name: 'Metformin', sales: 190, revenue: 8550 },
];

const CATEGORY_REVENUE = [
  { name: 'Tablets', value: 45000, color: '#16a34a' },
  { name: 'Vitamins', value: 38000, color: '#14b8a6' },
  { name: 'Syrups', value: 22000, color: '#3b82f6' },
  { name: 'Skincare', value: 15000, color: '#f59e0b' },
  { name: 'Baby Care', value: 9000, color: '#8b5cf6' },
];

const STATS = [
  { title: 'Monthly Revenue', value: '₹1,14,000', change: '+12.5%', positive: true, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-600' },
  { title: 'Total Orders', value: '285', change: '+8.3%', positive: true, icon: ShoppingBag, color: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600' },
  { title: 'New Customers', value: '73', change: '+15.2%', positive: true, icon: Users, color: 'bg-teal-50 dark:bg-teal-900/20', iconColor: 'text-teal-600' },
  { title: 'Avg Order Value', value: '₹400', change: '+4.1%', positive: true, icon: TrendingUp, color: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-600' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Performance overview for the last 6 months</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ title, value, change, positive, icon: Icon, color, iconColor }) => (
          <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={iconColor} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
            <p className={`text-xs font-medium mt-1 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              {change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Revenue (6 months)</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Monthly revenue trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Order Trend</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Monthly orders count</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="orders" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Medicines */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Selling Medicines</h3>
          <div className="space-y-3">
            {TOP_MEDICINES.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{m.sales} sold</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${(m.sales / TOP_MEDICINES[0].sales) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">₹{m.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_REVENUE} innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {CATEGORY_REVENUE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
