import { Keyboard, Mouse, Monitor, Headphones, HardDrive, Smartphone } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Keyboards', icon: Keyboard, href: '/products?category=keyboards', color: 'bg-pink-500/10 text-pink-500' },
    { name: 'Mice', icon: Mouse, href: '/products?category=mice', color: 'bg-cyan-500/10 text-cyan-500' },
    { name: 'Audio', icon: Headphones, href: '/products?category=audio', color: 'bg-indigo-500/10 text-indigo-500' },
    { name: 'Monitors', icon: Monitor, href: '/products?category=monitors', color: 'bg-orange-500/10 text-orange-500' },
    { name: 'Accessories', icon: HardDrive, href: '/products?category=accessories', color: 'bg-emerald-500/10 text-emerald-500' },
];

export function CategoryList() {
    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Browse Categories</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all group"
                    >
                        <div className={`mb-4 p-4 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                            <category.icon size={28} />
                        </div>
                        <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
