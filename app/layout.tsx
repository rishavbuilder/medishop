import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MobileNav from '@/components/mobile-nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'MediShop — Your Trusted Online Pharmacy', template: '%s | MediShop' },
  description: 'Order genuine medicines online at best prices. Fast delivery, expert pharmacists, and easy prescription upload.',
  keywords: ['online pharmacy', 'medicine delivery', 'buy medicines online', 'prescription medicines'],
  authors: [{ name: 'MediShop' }],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#15803d' },
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://medishop.in',
    title: 'MediShop — Your Trusted Online Pharmacy',
    description: 'Order genuine medicines online at best prices.',
    siteName: 'MediShop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 pt-[calc(4rem+28px)]">
                  {children}
                </main>
                <Footer />
                <MobileNav />
              </div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    borderRadius: '12px',
                    fontFamily: 'inherit',
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
