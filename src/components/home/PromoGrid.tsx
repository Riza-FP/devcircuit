import { Monitor, Cpu, BatteryCharging, Wifi } from 'lucide-react';
import Link from 'next/link';

export function PromoGrid() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
            {/* Large Card - Special Discount */}
            <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 shadow-xl border border-white/5 group">
                <div className="relative z-10 h-full flex flex-col justify-center items-start">
                    <span className="text-purple-300 font-semibold mb-2 tracking-wider text-sm uppercase">Special Offer</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Mechanical Keyboards <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Up to 30% OFF</span>
                    </h3>
                    <p className="text-indigo-200 mb-8 max-w-sm">
                        Experience typing nirvana with our new line of hot-swappable, gasket-mounted keyboards.
                    </p>
                    <Link href="/#products" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-purple-50 transition-colors">
                        Shop Collection
                    </Link>
                </div>
                {/* Abstract overlay */}
                <div className="absolute right-0 bottom-0 h-64 w-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-all duration-500" />
                <Cpu className="absolute -bottom-8 -right-8 text-white/5 h-64 w-64 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>

            {/* Small Card - Hot Deals */}
            <div className="col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl border border-white/5 group">
                <div className="relative z-10">
                    <span className="text-cyan-400 font-semibold mb-2 tracking-wider text-sm uppercase">New Arrival</span>
                    <h3 className="text-2xl font-bold text-white mb-4">Ergo Mouse Series</h3>
                    <div className="flex gap-2 mb-6">
                        <div className="bg-slate-700/50 p-2 rounded-lg backdrop-blur-sm">
                            <Wifi size={20} className="text-cyan-400" />
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded-lg backdrop-blur-sm">
                            <BatteryCharging size={20} className="text-green-400" />
                        </div>
                    </div>
                    <Link href="/#products" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 transition-colors">
                        View Details &rarr;
                    </Link>
                </div>
                <div className="absolute right-0 top-0 h-32 w-32 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />
                <Monitor className="absolute -bottom-4 -right-4 text-white/5 h-40 w-40 group-hover:scale-110 transition-transform duration-500" />
            </div>
        </section>
    );
}
