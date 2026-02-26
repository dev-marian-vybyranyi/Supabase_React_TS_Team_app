import { Package } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const NoProductsFound = () => {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">No products found.</p>
      </CardContent>
    </Card>
  );
};

export default NoProductsFound;
