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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
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
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, imageFile);

        if (uploadError) {
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
        throw new Error(`Database insert failed: ${insertError.message}`);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
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
        updated_at: new Date().toISOString(),
    };

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, imageFile);

        if (uploadError) {
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
        throw new Error(`Update failed: ${updateError.message}`);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`); // Assuming id based or slug? Usually slug. 
    // If slug changed, old url broken. I'm not updating slug on edit to avoid breaking links, or I should?
    // User didn't specify. I'll NOT update slug for now to keep URLs stable.

    return { success: true };
}
