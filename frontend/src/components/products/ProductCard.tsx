import { Package, Pencil } from "lucide-react";
import { useState } from "react";
import type { Tables } from "../../database.types";
export type Product = Tables<"products">;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import ProductDialog from "./ProductDialog";
import StatusBadge from "./StatusBadge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card key={product.id} className="pt-0">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-64 object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
          <Package className="h-24 w-24 text-gray-300" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="wrap-break-word">{product.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        {product.description && (
          <CardDescription className="wrap-break-word line-clamp-3">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <StatusBadge status={product.status} />
      </CardContent>

      <ProductDialog
        mode="edit"
        product={product}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </Card>
  );
};

export default ProductCard;
