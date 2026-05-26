'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowRight, Package, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/data';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const discount = appliedCoupon === 'SAVE10' ? totalPrice * 0.1 : 0;
  const deliveryFee = totalPrice >= 499 ? 0 : 49;
  const finalTotal = totalPrice - discount + deliveryFee;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      toast.success('Coupon SAVE10 applied! 10% discount.');
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const msg = generateWhatsAppMessage(items);
    openWhatsApp(msg);
    toast.success('Opening WhatsApp...');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Add medicines to your cart to get started</p>
          <Link href="/medicines" className="btn-primary inline-flex items-center gap-2">
            Browse Medicines <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Cart <span className="text-gray-400 font-normal text-lg">({totalItems} items)</span>
          </h1>
          <button
            onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex gap-4">
                  <Link href={`/medicines/${item.medicine.id}`} className="shrink-0">
                    <img
                      src={item.medicine.image_url}
                      alt={item.medicine.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 dark:border-gray-700"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/medicines/${item.medicine.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 line-clamp-1">
                          {item.medicine.name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.medicine.brand} · {item.medicine.unit}</p>
                      </div>
                      <button
                        onClick={() => { removeItem(item.medicine.id); toast.success('Item removed'); }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">₹{item.medicine.price.toFixed(2)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {item.medicine.requires_prescription && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Package size={12} /> Prescription required — please upload when placing order
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Tag size={16} className="text-green-600" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-xl border border-green-200 dark:border-green-800">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">{appliedCoupon}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">10% discount applied</p>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)} className="text-green-600 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 input-field py-2 text-sm"
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  />
                  <button onClick={applyCoupon} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors">
                    Apply
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Try: SAVE10 for 10% off</p>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Coupon Discount (SAVE10)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                    Add ₹{(499 - totalPrice).toFixed(2)} more to get free delivery
                  </p>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppOrder}
                className="btn-whatsapp w-full flex items-center justify-center gap-2 py-4 text-base"
              >
                <MessageCircle size={20} /> Order via WhatsApp
              </button>
              <Link
                href="/prescription"
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-green-600 text-green-600 dark:text-green-400 font-semibold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
              >
                Upload Prescription
              </Link>
            </div>

            {/* Safety note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              All medicines are verified and dispensed by our licensed pharmacist. Prescription medicines require a valid prescription.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
