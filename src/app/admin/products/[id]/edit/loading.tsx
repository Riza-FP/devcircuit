import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton";

export default function EditProductLoading() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Edit Product</h1>
            <ProductFormSkeleton />
        </div>
    );
}
