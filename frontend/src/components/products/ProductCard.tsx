import {
  CircleCheck,
  EllipsisVertical,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import type { ProductWithCreator } from "../../types/product.types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ProductDialog from "./ProductDialog";
import StatusBadge from "./StatusBadge";
export type Product = ProductWithCreator;

interface ProductCardProps {
  product: ProductWithCreator;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateProductStatus } = useProductStore();

  const handleStatusChange = async (newStatus: Product["status"]) => {
    setIsUpdating(true);
    try {
      await updateProductStatus(product.id, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasActions = product.status !== "Deleted";

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
          {hasActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={isUpdating}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {product.status === "Draft" && (
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {product.status === "Draft" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("Active")}
                  >
                    <CircleCheck className="h-4 w-4 mr-2 text-green-600" />
                    Activate
                  </DropdownMenuItem>
                )}
                {product.status === "Active" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("Deleted")}
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {product.description && (
          <CardDescription className="wrap-break-word line-clamp-3">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <StatusBadge status={product.status} />
        <div className="flex flex-col items-end gap-0.5">
          {product.profiles?.display_name && (
            <span className="text-xs font-medium text-foreground">
              {product.profiles.display_name}
            </span>
          )}
          {product.created_at && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(product.created_at).toLocaleDateString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </CardContent>

      {product.status === "Draft" && (
        <ProductDialog
          mode="edit"
          product={product}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </Card>
  );
};

export default ProductCard;
