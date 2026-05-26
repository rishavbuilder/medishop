import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Shield, Truck, HeartPulse, Award } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { label: 'All Medicines', href: '/medicines' },
    { label: 'Upload Prescription', href: '/prescription' },
    { label: 'My Cart', href: '/cart' },
    { label: 'Current Offers', href: '/offers' },
  ];

  const categories = [
    { label: 'Tablets & Capsules', href: '/medicines?category=tablets-capsules' },
    { label: 'Vitamins & Supplements', href: '/medicines?category=vitamins-supplements' },
    { label: 'Diabetes Care', href: '/medicines?category=diabetes-care' },
    { label: 'Cardiac Care', href: '/medicines?category=cardiac-care' },
    { label: 'Skincare', href: '/medicines?category=skincare' },
    { label: 'Baby Care', href: '/medicines?category=baby-care' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-16 pb-24 md:pb-12">
      {/* Trust badges */}
      <div className="border-b border-gray-800 pb-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: '100% Authentic', desc: 'Verified medicines only' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Same day in city' },
              { icon: HeartPulse, title: 'Expert Advice', desc: 'Licensed pharmacists' },
              { icon: Award, title: 'Licensed Pharmacy', desc: 'Govt. approved store' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <span className="text-green-400 font-bold text-xl leading-none">Medi</span>
                <span className="text-white font-bold text-xl leading-none">Shop</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted online pharmacy. Quality medicines, genuine products, delivered fast to your doorstep.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">123 Pharmacy Lane, Health Colony, Mumbai - 400001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-green-400 shrink-0" />
                <a href="tel:+919999999999" className="text-sm text-gray-400 hover:text-green-400 transition-colors">+91 99999 99999</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-green-400 shrink-0" />
                <a href="mailto:help@medishop.in" className="text-sm text-gray-400 hover:text-green-400 transition-colors">help@medishop.in</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Mon – Sat: 8:00 AM – 10:00 PM<br />Sun: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© 2024 MediShop. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
