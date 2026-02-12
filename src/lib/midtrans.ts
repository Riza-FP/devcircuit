'use server';

// @ts-ignore
import midtransClient from 'midtrans-client';

let snap: any;

try {
    snap = new midtransClient.Snap({
        isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true',
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
} catch (error) {
    console.error('Failed to initialize Midtrans Snap:', error);
}

export async function createTransaction(params: any) {
    if (!snap) {
        throw new Error('Midtrans Snap not initialized');
    }
    return snap.createTransaction(params);
}
