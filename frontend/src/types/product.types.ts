import type { Database } from "../database.types";

export interface ProductFormValues {
  title: string;
  description: string;
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductStatus = Database["public"]["Enums"]["product_status"];

export type ProductWithCreator = Product & {
  profiles: { display_name: string | null } | null;
};
