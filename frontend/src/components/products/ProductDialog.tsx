import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FormikHelpers } from "formik";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Database } from "../../database.types";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/productStore";
import type { ProductFormValues } from "../../types/product.types";
import { ProductForm } from "./ProductForm";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductDialogProps {
  mode: "create" | "edit";
  product?: Product;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ProductDialog({
  mode,
  product,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductDialogProps) {
  const { session, teamId } = useAuthStore();
  const { createProduct, updateProduct } = useProductStore();

  const [internalOpen, setInternalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen;

  const handleSubmit = async (
    values: ProductFormValues,
    { setSubmitting, setStatus, resetForm }: FormikHelpers<ProductFormValues>,
  ) => {
    setStatus(null);

    if (!teamId || !session?.user?.id) {
      toast.error("Authorization error");
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "edit" && product) {
        await updateProduct(
          product.id,
          {
            title: values.title,
            description: values.description,
          },
          imageFile,
          teamId,
        );
        toast.success("Product successfully updated!");
      } else {
        await createProduct(
          {
            title: values.title,
            description: values.description,
            teamId,
            userId: session.user.id,
          },
          imageFile,
        );
        toast.success("Product successfully created!");
        resetForm();
      }

      setImageFile(null);
      setIsOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : `Error ${mode === "edit" ? "updating" : "creating"} product`;
      toast.error(message);
      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  };

  const defaultValues: ProductFormValues | undefined =
    mode === "edit" && product
      ? { title: product.title, description: product.description ?? "" }
      : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </DialogTrigger>
      )}
      {mode === "edit" && !isControlled && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit product" : "Create new product"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ProductForm
            mode={mode}
            defaultValues={defaultValues}
            currentImageUrl={product?.image_url}
            imageFile={imageFile}
            onImageChange={setImageFile}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
