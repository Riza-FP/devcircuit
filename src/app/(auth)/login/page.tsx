'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            toast.success("Signed in successfully!");
            router.push("/");
        }

        catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false)
        }

    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                    alt="Gaming Peripherals"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
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
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                        <p className="text-sm text-slate-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot password?</a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        className="w-full border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800 hover:text-white"
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const { error } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback`,
                                    },
                                });
                                if (error) throw error;
                            } catch (error: any) {
                                toast.error(error.message);
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                    >
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}