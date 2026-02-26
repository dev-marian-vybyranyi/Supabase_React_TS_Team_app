import { useRef } from "react";
import {
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from "formik";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productSchema } from "../../schemas/product.schema";
import type { ProductFormValues } from "../../types/product.types";

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: ProductFormValues;
  currentImageUrl?: string | null;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  onRemoveCurrentImage?: () => void;
  onSubmit: (
    values: ProductFormValues,
    helpers: FormikHelpers<ProductFormValues>,
  ) => Promise<void>;
}

const emptyValues: ProductFormValues = {
  title: "",
  description: "",
};

export function ProductForm({
  mode,
  defaultValues,
  currentImageUrl,
  imageFile,
  onImageChange,
  onRemoveCurrentImage,
  onSubmit,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initialValues: ProductFormValues = defaultValues ?? emptyValues;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={productSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, status, errors, touched }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Product name</Label>
            <Field name="title">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="title"
                  type="text"
                  placeholder="Enter name..."
                  className={
                    errors.title && touched.title
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-green-600"
                  }
                />
              )}
            </Field>
            {errors.title && touched.title && (
              <p className="text-sm font-medium text-red-500">
                {errors.title as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Field name="description">
              {({ field }: FieldProps) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Add description..."
                  className={
                    errors.description && touched.description
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "focus-visible:ring-green-600"
                  }
                />
              )}
            </Field>
            {errors.description && touched.description && (
              <p className="text-sm font-medium text-red-500">
                {errors.description as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => onImageChange(e.target.files?.[0] || null)}
              className="focus-visible:ring-green-600"
            />
            {!imageFile && currentImageUrl && (
              <div className="flex items-center gap-2 mt-2 bg-muted/50 p-2 rounded-md">
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="h-20 w-20 object-cover rounded-md"
                />
                <p className="text-xs text-muted-foreground truncate flex-1">
                  Current image
                </p>
                {onRemoveCurrentImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                    onClick={onRemoveCurrentImage}
                    title="Remove current image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            {imageFile && (
              <div className="flex items-center gap-2 mt-2 bg-muted/50 p-2 rounded-md">
                <p className="text-xs text-muted-foreground truncate flex-1">
                  {imageFile.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {status && (
            <p className="text-sm font-medium text-red-500">{status}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating..."
                : "Saving..."
              : mode === "edit"
                ? "Update"
                : "Save"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
