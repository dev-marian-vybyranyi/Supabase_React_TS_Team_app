import { create } from "zustand";
import type { Database } from "../database.types";
import { supabase } from "../supabaseClient";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductStatus = Database["public"]["Enums"]["product_status"];

const DEFAULT_PAGE_SIZE = 6;

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  totalCount: number;

  statusFilter: ProductStatus | null;
  sortOrder: "newest" | "oldest";

  fetchProducts: (teamId: string) => Promise<void>;
  addProduct: (product: Product) => void;
  setPage: (page: number) => void;
  setStatusFilter: (status: ProductStatus | null) => void;
  setSortOrder: (order: "newest" | "oldest") => void;
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
    removeImage?: boolean,
    oldImageUrl?: string | null,
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

  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,

  statusFilter: null,
  sortOrder: "newest" as const,

  fetchProducts: async (teamId) => {
    const { page, pageSize, statusFilter, sortOrder } = get();
    set({ isLoading: true, error: null });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("team_id", teamId)
      .order("created_at", { ascending: sortOrder === "oldest" })
      .range(from, to);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error, count } = await query;

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    set({
      products: data || [],
      totalCount: count ?? 0,
      isLoading: false,
    });
  },

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  setPage: (page) => set({ page }),
  setStatusFilter: (status) => set({ statusFilter: status, page: 1 }),
  setSortOrder: (order) => set({ sortOrder: order, page: 1 }),

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

  updateProduct: async (
    productId,
    data,
    imageFile,
    teamId,
    removeImage,
    oldImageUrl,
  ) => {
    const getStoragePath = (url: string) => {
      const marker = "/object/public/product-images/";
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      return url.substring(idx + marker.length);
    };

    if (oldImageUrl && (imageFile || removeImage)) {
      const oldPath = getStoragePath(oldImageUrl);
      if (oldPath) {
        await supabase.storage.from("product-images").remove([oldPath]);
      }
    }

    let imageUrl: string | null | undefined;

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
    } else if (removeImage) {
      imageUrl = null;
    }

    const updateData: Record<string, unknown> = {
      title: data.title,
      description: data.description,
    };
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

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
