'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/use-auth-store';

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
        const initializeAuth = async () => {
            setLoading(true);

            // 1. Get Session
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            // 2. Get Role if user exists
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin');
            } else {
                setIsAdmin(false);
            }

            setLoading(false);

            // 3. Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();
                    setIsAdmin(profile?.role === 'admin');
                } else {
                    setIsAdmin(false);
                }

                setLoading(false);
            });

            return () => subscription.unsubscribe();
        };

        initializeAuth();
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
