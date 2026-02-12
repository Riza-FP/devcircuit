import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Package, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/'); // Redirect non-admins to home
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AdminNav userEmail={user.email} />
            <main className="flex-1 container py-6 mx-auto">{children}</main>
        </div >
    );
}
