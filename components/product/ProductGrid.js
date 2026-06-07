import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500" role="status">
        No products match your search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
