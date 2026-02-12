import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/ProductGrid';
import { HeroSection } from '@/components/home/HeroSection';
import { PromoGrid } from '@/components/home/PromoGrid';
import { CategoryList } from '@/components/home/CategoryList';

export default async function Home() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Promo / Bento Grid */}
      <PromoGrid />

      {/* 3. Category List */}
      <CategoryList />

      {/* 4. Product Grid (Recommended) */}
      <section id="products" className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Recommended For You</h2>
          <a href="/products" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            View All &rarr;
          </a>
        </div>
        <ProductGrid products={products || []} />
      </section>

      {/* 5. About / Footer CTA */}
      <section id="about" className="mt-24 mb-12 rounded-2xl overflow-hidden relative h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95" />
          {/* Gradient Accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DevCircuit</span>?
          </h2>

          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            We curate the best gear for software engineers, data scientists, and digital creators.
            From tactile switches that satisfy your ears to ergonomic setups that save your back — we've got you covered.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-white mb-2">Fast Shipping</h3>
              <p className="text-sm text-slate-400">Same-day dispatch for nearby areas</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-white mb-2">2-Year Warranty</h3>
              <p className="text-sm text-slate-400">Full coverage on all products</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-semibold text-white mb-2">Dev Tested</h3>
              <p className="text-sm text-slate-400">Approved by real developers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
