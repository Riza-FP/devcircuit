'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/use-auth-store';
import { useCartStore } from '@/store/use-cart-store';

type SupabaseContextType = {
    supabase: SupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    const { setUser, setSession, setIsAdmin, setLoading } = useAuthStore();

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            setLoading(true);

            // 1. Get Session
            const { data: { session: initialSession } } = await supabase.auth.getSession();

            if (!mounted) return;

            setSession(initialSession);
            setUser(initialSession?.user ?? null);

            // 2. Get Role if user exists
            if (initialSession?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', initialSession.user.id)
                    .single();

                if (mounted) {
                    setIsAdmin(profile?.role === 'admin');
                }
            } else {
                setIsAdmin(false);
            }

            if (mounted) setLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (mounted) setIsAdmin(profile?.role === 'admin');

                // Sync Cart
                if (event === 'SIGNED_IN') {
                    await useCartStore.getState().syncWithUser();
                }
            } else {
                if (mounted) setIsAdmin(false);
                // Clear Cart on Sign Out
                if (event === 'SIGNED_OUT') {
                    useCartStore.getState().clearCart();
                }
            }

            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase, setUser, setSession, setIsAdmin, setLoading]);

    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};
