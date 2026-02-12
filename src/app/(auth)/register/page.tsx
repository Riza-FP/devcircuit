'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            // Check if session was created (auto-login enabled in Supabase?)
            // If email confirm is enabled, user won't have a session yet.
            toast.success("Registration successful! Please check your email for verification.");
            router.push("/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop"
                    alt="Mechanical Keyboard"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                            D
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            Dev<span className="text-cyan-400">Circuit</span>
                        </span>
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl">
                    <div className="space-y-2 text-center mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Create an Account</h1>
                        <p className="text-sm text-slate-400">Join the community of developers</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <Input
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium" disabled={loading}>
                            {loading ? "Creating account..." : "Register"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}