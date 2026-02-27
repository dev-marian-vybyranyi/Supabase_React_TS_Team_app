import NoProductsFound from "@/components/products/NoProductsFound";
import Pagination from "@/components/products/Pagination";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import ProductSkeleton from "@/components/products/ProductSkeleton";
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
    userFilter,
    searchQuery,
    fetchProducts,
    setPage,
    setStatusFilter,
  } = useProductStore();

  const totalPages = Math.ceil(totalCount / pageSize);

  const refetch = useCallback(() => {
    if (teamId) fetchProducts(teamId);
  }, [teamId, fetchProducts]);

  useEffect(() => {
    refetch();
  }, [page, statusFilter, sortOrder, userFilter, searchQuery, refetch]);

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
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      );
    }
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
        <TabsList className="flex flex-wrap h-auto w-full sm:w-auto mb-4 justify-start sm:justify-center">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Draft">Drafts</TabsTrigger>
          <TabsTrigger value="Active">Active</TabsTrigger>
          <TabsTrigger value="Deleted">Deleted</TabsTrigger>
        </TabsList>

        <ProductFilters />

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
