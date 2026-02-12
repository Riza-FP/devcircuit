import { Keyboard, Mouse, Monitor, Headphones, HardDrive, Smartphone } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Keyboards', icon: Keyboard, href: '/#products', color: 'bg-pink-500/10 text-pink-500' },
    { name: 'Mice', icon: Mouse, href: '/#products', color: 'bg-cyan-500/10 text-cyan-500' },
    { name: 'Audio', icon: Headphones, href: '/#products', color: 'bg-indigo-500/10 text-indigo-500' },
    { name: 'Monitors', icon: Monitor, href: '/#products', color: 'bg-orange-500/10 text-orange-500' },
    { name: 'Accessories', icon: HardDrive, href: '/#products', color: 'bg-emerald-500/10 text-emerald-500' },
];

export function CategoryList() {
    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
                <div className="flex gap-2">
                    {/* Navigation arrows could go here */}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-800 hover:border-white/10 transition-all group"
                    >
                        <div className={`mb-4 p-4 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                            <category.icon size={28} />
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
