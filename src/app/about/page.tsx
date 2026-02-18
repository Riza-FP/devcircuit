import { Code2, Heart, Globe, Users, Coffee, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32 bg-slate-900 border-b border-white/10">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                </div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 mb-6 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                        Building for Builders
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                        Empowering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Next Generation</span> of Coders
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10">
                        At DevCircuit, we believe that great software starts with great gear. We curate high-performance tools that help you stay in the flow and ship code faster.
                    </p>
                </div>
            </section>

            {/* 2. Our Mission */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                            {/* Placeholder for a cool dev setup image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 mix-blend-overlay z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                                alt="Coding Setup"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Code2 className="text-primary" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                Started in a small garage by two developers who were tired of generic office gear, DevCircuit has grown into a global community.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                We don't just sell keyboards and mice; we sell **productivity**. Every product in our catalog is hand-tested by senior engineers to ensure tactile perfection, ergonomic comfort, and durability.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-foreground">10k+</span>
                                    <span className="text-sm text-muted-foreground">Devs Happy</span>
                                </div>
                                <div className="w-px bg-border h-12" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-foreground">50+</span>
                                    <span className="text-sm text-muted-foreground">Countries</span>
                                </div>
                                <div className="w-px bg-border h-12" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-foreground">24/7</span>
                                    <span className="text-sm text-muted-foreground">Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Values Grid */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl text-center">
                    <h2 className="text-3xl font-bold mb-16">Why We Do It</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Open Source First</h3>
                            <p className="text-muted-foreground">
                                We contribute 1% of our revenue back to the open-source projects that power our world.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-6">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                            <p className="text-muted-foreground">
                                We listen. Our product roadmap is 100% driven by feature requests from our Discord community.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Quality Obsessed</h3>
                            <p className="text-muted-foreground">
                                If it doesn't survive a 24-hour hackathon, we don't sell it. Period.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Team CTA */}
            <section className="py-20 px-4 text-center">
                <div className="container mx-auto max-w-4xl p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <Users className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join the Movement</h2>
                        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                            Whether you're a junior dev or a principal architect, there's a place for you at DevCircuit.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/products">
                                <button className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition-colors">
                                    Browse Gear
                                </button>
                            </Link>
                            <Link href="/">
                                <button className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm transition-colors">
                                    Read Blog
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
