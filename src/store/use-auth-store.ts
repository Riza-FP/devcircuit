import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setLoading: (isLoading) => set({ isLoading }),
}));
