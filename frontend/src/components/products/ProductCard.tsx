import { Package } from "lucide-react";
import type { Tables } from "../../database.types";
export type Product = Tables<"products">;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import StatusBadge from "./StatusBadge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
        <CardTitle className="wrap-break-word">{product.title}</CardTitle>

        {product.description && (
          <CardDescription className="wrap-break-word line-clamp-3">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <StatusBadge status={product.status} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
