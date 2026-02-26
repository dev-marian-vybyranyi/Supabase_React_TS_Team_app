import Loader from "@/components/Loader";
import NoProductsFound from "@/components/products/NoProductsFound";
import Pagination from "@/components/products/Pagination";
import ProductCard from "@/components/products/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { useCallback, useEffect } from "react";

const ProductsList = () => {
  const { teamId } = useAuthStore();
  const {
    products,
    isLoading,
    page,
    pageSize,
    totalCount,
    statusFilter,
    sortOrder,
    fetchProducts,
    setPage,
    setStatusFilter,
    setSortOrder,
  } = useProductStore();

  const totalPages = Math.ceil(totalCount / pageSize);

  const refetch = useCallback(() => {
    if (teamId) fetchProducts(teamId);
  }, [teamId, fetchProducts]);

  useEffect(() => {
    refetch();
  }, [page, statusFilter, sortOrder, refetch]);

  const handleTabChange = (value: string) => {
    if (value === "all") {
      setStatusFilter(null);
    } else {
      setStatusFilter(value as "Draft" | "Active" | "Deleted");
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const activeTab = statusFilter ?? "all";

  const renderGrid = () => {
    if (isLoading) return <Loader text="Loading products..." />;
    if (products.length === 0) return <NoProductsFound />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-lg grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Draft">Drafts</TabsTrigger>
          <TabsTrigger value="Active">Active</TabsTrigger>
          <TabsTrigger value="Deleted">Deleted</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground ml-auto">
              {totalCount} product{totalCount !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        <TabsContent value={activeTab} forceMount>
          {renderGrid()}
        </TabsContent>
      </Tabs>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default ProductsList;
