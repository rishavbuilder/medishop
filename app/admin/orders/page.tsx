'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Package } from 'lucide-react';
import { STATUS_COLORS, ORDER_STATUSES, OrderStatus } from '@/lib/data';

const ORDERS = [
  { id: 'ORD-2024-001', customer: 'Priya Sharma', phone: '+91 98765 43210', address: '123 MG Road, Mumbai 400001', items: [{ name: 'Dolo 650', qty: 2, price: 61 }, { name: 'Vitamin D3', qty: 1, price: 199 }], total: 260, status: 'delivered' as OrderStatus, created: '2024-12-15', hasPrescription: false },
  { id: 'ORD-2024-002', customer: 'Rajesh Kumar', phone: '+91 98765 12345', address: '45 Nehru Street, Delhi 110001', items: [{ name: 'Metformin 500mg', qty: 3, price: 135 }, { name: 'Atorvastatin 10mg', qty: 2, price: 190 }], total: 325, status: 'shipped' as OrderStatus, created: '2024-12-14', hasPrescription: true },
  { id: 'ORD-2024-003', customer: 'Anita Patel', phone: '+91 87654 32109', address: 'B-12 Baner, Pune 411045', items: [{ name: 'Cetrizine 10mg', qty: 1, price: 25 }, { name: 'Benadryl Syrup', qty: 1, price: 95 }], total: 120, status: 'processing' as OrderStatus, created: '2024-12-13', hasPrescription: false },
  { id: 'ORD-2024-004', customer: 'Suresh Nair', phone: '+91 76543 21098', address: '78 Anna Salai, Chennai 600001', items: [{ name: 'Amoxicillin 500mg', qty: 2, price: 240 }], total: 240, status: 'confirmed' as OrderStatus, created: '2024-12-12', hasPrescription: true },
  { id: 'ORD-2024-005', customer: 'Meena Singh', phone: '+91 65432 10987', address: '15 Civil Lines, Jaipur 302001', items: [{ name: 'Omega-3 Fish Oil', qty: 1, price: 350 }, { name: 'Ashwagandha KSM-66', qty: 1, price: 299 }], total: 649, status: 'pending' as OrderStatus, created: '2024-12-11', hasPrescription: false },
  { id: 'ORD-2024-006', customer: 'Vikram Joshi', phone: '+91 54321 09876', address: '32 Sadashiv Peth, Pune 411030', items: [{ name: 'Pantoprazole 40mg', qty: 1, price: 85 }], total: 85, status: 'cancelled' as OrderStatus, created: '2024-12-10', hasPrescription: false },
];

type Order = typeof ORDERS[number];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(o => o ? { ...o, status: newStatus } : null);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Status chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {[{ label: 'All', value: '' }, ...ORDER_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              statusFilter === value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {label} {value && <span className="ml-1 text-xs">({orders.filter(o => o.status === value).length})</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md ${
                selectedOrder?.id === order.id
                  ? 'border-green-500 shadow-md ring-2 ring-green-500/20'
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{order.customer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.id} · {order.created}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Package size={14} />
                  <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  {order.hasPrescription && <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Rx</span>}
                </div>
                <span className="font-bold text-gray-900 dark:text-white">₹{order.total}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No orders found</div>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Order Details</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{selectedOrder.id}</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Customer */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-2">Customer</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.phone}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedOrder.address}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{item.name} × {item.qty}</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`py-2 text-xs font-medium rounded-xl transition-all capitalize ${
                        selectedOrder.status === s
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {selectedOrder.hasPrescription && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  This order has a prescription attached. Please verify before dispensing.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center h-64">
            <p className="text-gray-400 text-sm">Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
