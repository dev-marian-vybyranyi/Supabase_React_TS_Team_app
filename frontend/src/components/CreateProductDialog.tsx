import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FormikHelpers } from "formik";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import type { CreateProductFormValues } from "../types/product.types";
import { CreateProductForm } from "./CreateProductForm";

export default function CreateProductDialog() {
  const { session, teamId } = useAuthStore();
  const { createProduct } = useProductStore();

  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (
    values: CreateProductFormValues,
    {
      setSubmitting,
      setStatus,
      resetForm,
    }: FormikHelpers<CreateProductFormValues>,
  ) => {
    setStatus(null);

    if (!teamId || !session?.user?.id) {
      toast.error("Authorization error");
      setSubmitting(false);
      return;
    }

    try {
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
      setImageFile(null);
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        setStatus(error.message);
      } else {
        toast.error("Error creating product");
        setStatus("Error creating product");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add product
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create new product</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CreateProductForm
            imageFile={imageFile}
            onImageChange={setImageFile}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
