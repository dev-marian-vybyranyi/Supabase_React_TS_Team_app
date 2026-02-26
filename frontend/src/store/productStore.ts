import { create } from "zustand";
import type { Database } from "../database.types";
import { supabase } from "../supabaseClient";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

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
  updateProduct: (
    productId: string,
    data: { title: string; description: string },
    imageFile?: File | null,
    teamId?: string,
  ) => Promise<void>;
  updateProductStatus: (
    productId: string,
    newStatus: Product["status"],
  ) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async (teamId) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    set({ products: data || [], isLoading: false });
  },

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  createProduct: async ({ title, description, teamId, userId }, imageFile) => {
    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${teamId}/${Math.random()}.${fileExt}`;

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

    get().addProduct(newProduct);
  },

  updateProduct: async (productId, data, imageFile, teamId) => {
    let imageUrl: string | undefined;

    if (imageFile && teamId) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${teamId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const updateData: Record<string, unknown> = {
      title: data.title,
      description: data.description,
    };
    if (imageUrl) updateData.image_url = imageUrl;

    const { data: updated, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      products: state.products.map((p) => (p.id === productId ? updated : p)),
    }));
  },

  updateProductStatus: async (productId, newStatus) => {
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId);

    if (error) throw error;

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, status: newStatus } : p,
      ),
    }));
  },
}));
