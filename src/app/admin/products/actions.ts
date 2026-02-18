'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    // Verify session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Create Product: Auth Error', authError);
            throw new Error('Unauthorized');
        }

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const stock = parseInt(formData.get('stock') as string);
        const category_id = formData.get('category_id') as string;
        const imageFile = formData.get('image') as File | null;

        if (!name || !price || !category_id) {
            throw new Error('Missing required fields');
        }

        let imageUrl = null;

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Create Product: Image Upload Error', uploadError);
                throw new Error(`Image upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const { error: insertError } = await supabase.from('products').insert({
            name,
            slug,
            description,
            price,
            stock,
            category_id,
            image_url: imageUrl,
        });

        if (insertError) {
            console.error('Create Product: DB Insert Error', insertError);
            throw new Error(`Database insert failed: ${insertError.message}`);
        }

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };

    } catch (error: any) {
        console.error('Create Product: Critical Failure', error);
        throw new Error(error.message || 'Failed to create product');
    }
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Update Product: Auth Error', authError);
            throw new Error('Unauthorized');
        }

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const stock = parseInt(formData.get('stock') as string);
        const category_id = formData.get('category_id') as string;
        const imageFile = formData.get('image') as File | null;

        if (!id || !name) {
            throw new Error('Missing required fields');
        }

        const updates: any = {
            name,
            description,
            price,
            stock,
            category_id,
            // updated_at is handled by DB trigger usually, but safe to send
            updated_at: new Date().toISOString(),
        };

        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Update Product: Image Upload Error', uploadError);
                throw new Error(`Image upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            updates.image_url = publicUrl;
        }

        const { error: updateError } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id);

        if (updateError) {
            console.error('Update Product: DB Update Error', updateError);
            throw new Error(`Update failed: ${updateError.message}`);
        }

        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath(`/products/${id}`); // Revalidate detail page too

        return { success: true };

    } catch (error: any) {
        console.error('Update Product: Critical Failure', error);
        throw new Error(error.message || 'Failed to update product');
    }
}
