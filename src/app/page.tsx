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


    </div>
  );
}
