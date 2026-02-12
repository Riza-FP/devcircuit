export type Product = {
    id: string;
    created_at: string;
    updated_at: string; // Good for tracking inventory changes
    name: string;
    slug: string;       // Necessary for SEO-friendly URLs (e.g., /product/gaming-mouse)
    description: string | null;
    price: number;
    stock: number;      // Critical for your real-time stock update feature
    image_url: string | null;
    category_id: string; // In the DB, this is a foreign key
    category?: {         // Optional: Used when you 'join' the categories table in a query
        name: string;
        slug: string;
    };
    is_deleted?: boolean;
};

export type CartItem = Product & {
    quantity: number;
};