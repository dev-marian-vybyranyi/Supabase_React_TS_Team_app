import Loader from "@/components/Loader";
import NoProductsFound from "@/components/products/NoProductsFound";
import ProductCard from "@/components/products/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductStore } from "@/store/productStore";

const ProductsList = () => {
  const { products, isLoading } = useProductStore();

  if (isLoading) return <Loader text="Loading products..." />;

  const activeProducts = products.filter((p) => p.status === "Active");
  const draftProducts = products.filter((p) => p.status === "Draft");
  const deletedProducts = products.filter((p) => p.status === "Deleted");

  const renderGrid = (items: typeof products) => {
    if (items.length === 0) return <NoProductsFound />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="draft">
            Drafts ({draftProducts.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeProducts.length})
          </TabsTrigger>
          <TabsTrigger value="deleted">
            Deleted ({deletedProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draft">{renderGrid(draftProducts)}</TabsContent>
        <TabsContent value="active">{renderGrid(activeProducts)}</TabsContent>
        <TabsContent value="deleted">{renderGrid(deletedProducts)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsList;
