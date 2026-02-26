import { create } from "zustand";
import { supabase } from "../supabaseClient";
import type { Database } from "../database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductState {
  products: Product[];
  isLoading: boolean;

  fetchProducts: (teamId: string) => Promise<void>;
  addProduct: (product: Product) => void;
  createProduct: (
    data: {
      title: string;
      description: string;
      teamId: string;
      userId: string;
    },
    imageFile?: File | null,
  ) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async (teamId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ products: data || [] });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  createProduct: async ({ title, description, teamId, userId }, imageFile) => {
    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${teamId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data: newProduct, error: dbError } = await supabase
      .from("products")
      .insert({
        title,
        description,
        image_url: imageUrl,
        team_id: teamId,
        created_by: userId,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    useProductStore.getState().addProduct(newProduct);
  },
}));
