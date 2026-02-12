export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    quantity: number;
    unit_price: number;
    created_at: string;
    // Joined product data for display
    product?: {
        name: string;
        image_url: string | null;
        slug: string;
    };
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    payment_id: string | null; // Midtrans Order ID
    snap_token?: string | null; // For Midtrans Popup
    shipping_details?: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postal_code: string;
    } | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}
