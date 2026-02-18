'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function requestCancellation(orderId: string, reason: string) {
    const supabase = await createClient();

    // Use type casting if 'cancellation_requested' is not in the generated TypeScript types yet
    const { error } = await supabase
        .from('orders')
        .update({
            status: 'cancellation_requested' as any,
            cancellation_reason: reason
        })
        .eq('id', orderId);

    if (error) {
        console.error('Error requesting cancellation:', error);
        throw new Error('Failed to request cancellation');
    }

    revalidatePath('/orders');
    revalidatePath('/admin/orders');
}

export async function approveCancellation(orderId: string) {
    const supabase = await createClient();

    // In a real app, you might want to call Midtrans refund API here
    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

    if (error) {
        console.error('Error approving cancellation:', error);
        throw new Error('Failed to approve cancellation');
    }

    revalidatePath('/orders');
    revalidatePath('/admin/orders');
}

export async function rejectCancellation(orderId: string) {
    const supabase = await createClient();

    // Reset to 'paid' and clear the reason
    const { error } = await supabase
        .from('orders')
        .update({
            status: 'paid',
            cancellation_reason: null
        })
        .eq('id', orderId);

    if (error) {
        console.error('Error rejecting cancellation:', error);
        throw new Error('Failed to reject cancellation');
    }

    revalidatePath('/orders');
    revalidatePath('/admin/orders');
}
