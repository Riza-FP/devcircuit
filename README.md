# DevCircuit - Tech Store 🛍️

A modern, full-stack e-commerce application built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Features real-time stock updates, secure payments via Midtrans, and a comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **Product Browsing**: Filter by category, search, and sort products.
- **Real-Time Stock**: See live stock levels; "Add to Cart" disables instantly when out of stock.
- **Shopping Cart**: smooth cart management with local persistence.
- **Checkout System**: Secure checkout with shipping details.
- **Payment Integration**: Integrated with **Midtrans** for real payments (Support for manual refresh if preferred).
- **Order Tracking**: Receive email confirmations (via Resend) and track order status.

### Admin Dashboard 🛡️
- **Dashboard Overview**: Monitor orders and products.
- **Product Management**: Create, Read, Update, Delete (CRUD) products with image upload.
- **Order Management**: View all orders, update statuses (Paid, Shipped, Cancelled).
- **Secure Access**: Role-based access control (RBAC) protecting admin routes.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Payment Gateway**: [Midtrans](https://midtrans.com/)
- **Email**: [Resend](https://resend.com/) + [React Email](https://react.email/)

## ⚙️ Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Riza-FP/DevCircuit.git
    cd quickshop
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in your credentials.
    ```bash
    cp .env.example .env.local
    ```

4.  **Database Setup (Supabase)**:
    -   Create a new Supabase project.
    -   Run the SQL scripts provided in `database/schema.sql` (if available) or use the migration files.
    -   **Important**: Enable Realtime for `products` and `orders` tables in Supabase Dashboard > Database > Replication.
    -   Create a Storage Bucket named `products` and set up RLS policies for public read/authenticated upload.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📦 Deployment

Deploy easily to **Vercel**:
1.  Push your code to GitHub.
2.  Import project into Vercel.
3.  Add the Environment Variables from `.env.local`.
4.  Deploy!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
