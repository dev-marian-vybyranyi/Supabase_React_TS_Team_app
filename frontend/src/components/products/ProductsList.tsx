import Loader from "@/components/Loader";
import NoProductsFound from "@/components/products/NoProductsFound";
import ProductCard from "@/components/products/ProductCard";
import { useProductStore } from "@/store/productStore";

const ProductsList = () => {
  const { products, isLoading } = useProductStore();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {isLoading ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <NoProductsFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
