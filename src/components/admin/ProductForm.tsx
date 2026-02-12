'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '@/app/admin/products/actions';
import { Product } from '@/types/product';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    category_id: z.string().uuid("Invalid Category ID"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: Product;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price?.toString() || '',
            stock: initialData?.stock?.toString() || '',
            category_id: initialData?.category_id || '',
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('stock', data.stock);
            formData.append('category_id', data.category_id);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            let result;
            if (initialData) {
                formData.append('id', initialData.id);
                result = await updateProduct(formData);
            } else {
                result = await createProduct(formData);
            }

            if (result?.success) {
                toast.success(initialData ? 'Product updated!' : 'Product created!');
                router.push('/admin/products');
                router.refresh();
            }
        } catch (error: any) {
            console.error('💥 Error saving product:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-xl border border-border mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Mechanical Keyboard" {...field} className="bg-input/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <textarea
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Product details..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (IDR)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="1000"
                                                placeholder="1500000"
                                                {...field}
                                                className="bg-input/50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Stock */}
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                className="bg-input/50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Category Select */}
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-input/50">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Image Upload Side */}
                    <div className="space-y-4">
                        <FormLabel>Product Image</FormLabel>
                        <div className="border-2 border-dashed border-input rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer relative bg-input/20 h-[300px] overflow-hidden group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {previewUrl ? (
                                <>
                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Upload className="text-white w-10 h-10" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                                    <span className="text-sm font-medium">Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold py-6 text-lg hover:scale-[1.005] transition-transform mt-8"
                    size="lg"
                >
                    {loading && <Loader2 className="animate-spin mr-2" />}
                    {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
                </Button>
            </form>
        </Form>
    );
}
