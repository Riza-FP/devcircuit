import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-3xl h-[600px] flex items-center shadow-2xl">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
                {/* Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/10" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full">
                <div className="max-w-2xl">
                    <span className="mb-4 inline-block rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 ring-1 ring-inset ring-cyan-500/20 backdrop-blur-sm">
                        New Arrivals
                    </span>

                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight">
                        Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dev Setup</span>
                    </h1>

                    <p className="text-xl leading-8 text-gray-300 mb-10 max-w-xl">
                        Premium mechanical keyboards, ergonomic accessories, and high-performance gear designed for developers who code 10x faster.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/#products"
                            className="rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 hover:shadow-cyan-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Shop Now <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/#about"
                            className="rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-white/20 ring-1 ring-inset ring-white/20 backdrop-blur-md transition-all flex items-center justify-center"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-30 blur-3xl pointer-events-none">
                <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-cyan-500 to-blue-500 opacity-40" />
            </div>
        </section>
    );
}
