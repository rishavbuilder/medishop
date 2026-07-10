# 💊 Medishop — Online Medicine Store

> **Your trusted online pharmacy** — Browse medicines, upload prescriptions, manage cart, and order securely.

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
</p>

---

## ✨ Features

- 🔍 **Medicine Search** — Find medicines by name, category, or symptom
- 📋 **Prescription Upload** — Upload prescriptions for medicine verification
- 🛒 **Smart Cart** — Add/remove medicines and track total cost
- 💰 **Secure Payments** — Multiple payment options available
- 📦 **Order Tracking** — Track your medicine deliveries in real-time
- 👤 **User Accounts** — Create account, save favorites, view history
- 🏥 **Verified Pharmacy** — Licensed and certified online pharmacy
- ⭐ **Medicine Reviews** — Read and write reviews about products
- 📱 **Mobile Responsive** — Shop from any device

## 🛠️ Tech Stack

| Component | Technology |
|-----------|----------|
| **Frontend** | Next.js, React, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage (for prescriptions) |
| **Payments** | Stripe / Razorpay (optional) |

## 🛍️ Product Categories

- Vitamins & Supplements
- Pain Relief
- Cold & Cough
- Digestive Health
- Skin Care
- Allergy Relief
- First Aid
- and many more!

## 🏁 Getting Started

```bash
# Clone the repository
git clone https://github.com/rishavbuilder/medishop.git
cd medishop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
src/
├── app/              # Next.js app routes
├── components/       # React components
│   ├── medicines/    # Medicine listing & details
│   ├── cart/        # Shopping cart
│   ├── checkout/    # Checkout process
│   ├── orders/      # Order management
│   └── auth/        # Authentication UI
├── lib/             # Utilities & API clients
├── hooks/           # Custom React hooks
└── styles/          # Global styles
```

## 🎯 Core Features

### 🔍 Medicine Discovery
- Browse by category
- Search by medicine name
- Filter by price, rating, availability
- Sort by popularity, price, rating
- Related products suggestions

### 📝 Prescription Management
- Upload prescription images
- Prescription verification
- Prescription history
- Reorder medicines from prescriptions

### 🛒 Shopping Cart
- Add/remove medicines
- Adjust quantities
- Real-time price updates
- Save for later functionality

### 📦 Order Management
- Place orders securely
- Track order status in real-time
- View order history
- Cancel/modify orders
- Download invoices

### 💬 Reviews & Ratings
- Rate purchased medicines
- Read customer reviews
- Share experiences
- Helpful review votes

### 👤 User Management
- Create and manage account
- Save favorite medicines
- Address book
- Payment methods
- Order history

## 🔐 Security Features

- SSL/TLS encryption
- Secure prescription uploads
- PCI DSS compliance
- Data privacy protection
- Regular security audits
- Secure authentication

## 🚀 Deployment

Deploy on Vercel for fast, reliable hosting:

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Made with ❤️ by [rishavbuilder](https://github.com/rishavbuilder)**