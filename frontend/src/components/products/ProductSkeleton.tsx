import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductSkeleton = () => {
  return (
    <Card className="pt-0 overflow-hidden">
      <Skeleton className="w-full h-64 rounded-xl" />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardHeader>

      <CardContent className="mt-auto flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />

        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSkeleton;
