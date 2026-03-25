import { create } from "zustand";
import { supabase } from "../supabaseClient";
import type {
  Product,
  ProductStatus,
  ProductWithCreator,
} from "../types/product.types";

const DEFAULT_PAGE_SIZE = 6;

interface ProductState {
  products: ProductWithCreator[];
  isLoading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  totalCount: number;

  statusFilter: ProductStatus | null;
  sortOrder: "newest" | "oldest";
  userFilter: string | null;
  searchQuery: string;

  fetchProducts: (teamId: string) => Promise<void>;
  setPage: (page: number) => void;
  setStatusFilter: (status: ProductStatus | null) => void;
  setSortOrder: (order: "newest" | "oldest") => void;
  setUserFilter: (userId: string | null) => void;
  setSearchQuery: (query: string) => void;
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
  userFilter: null,
  searchQuery: "",

  fetchProducts: async (teamId) => {
    const { page, pageSize, statusFilter, sortOrder, userFilter, searchQuery } =
      get();
    set({ isLoading: true, error: null });

    try {
      const searchParams = new URLSearchParams({
        teamId,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortOrder,
      });
      if (statusFilter) searchParams.append("statusFilter", statusFilter);
      if (userFilter) searchParams.append("userFilter", userFilter);
      if (searchQuery) searchParams.append("searchQuery", searchQuery);

      const { data, error } = await supabase.functions.invoke(
        `products?${searchParams.toString()}`,
        {
          method: "GET",
        },
      );

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      set({
        products: data.data || [],
        totalCount: data.count ?? 0,
        isLoading: false,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: String(error), isLoading: false });
      }
    }
  },

  setPage: (page) => set({ page }),
  setStatusFilter: (status) => set({ statusFilter: status, page: 1 }),
  setSortOrder: (order) => set({ sortOrder: order, page: 1 }),
  setUserFilter: (userId) => set({ userFilter: userId, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),

  createProduct: async ({ title, description, teamId }, imageFile) => {
    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${teamId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase.functions.invoke("products", {
      method: "POST",
      body: {
        title,
        description,
        teamId,
        imageUrl,
      },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    set({ page: 1 });
    get().fetchProducts(teamId);
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
      const filePath = `${teamId}/${crypto.randomUUID()}.${fileExt}`;

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

    const { data: updatedResponse, error } = await supabase.functions.invoke(
      "products",
      {
        method: "PATCH",
        body: {
          productId,
          title: data.title,
          description: data.description,
          imageUrl,
          removeImage,
        },
      },
    );

    if (error) throw error;
    if (!updatedResponse.success) throw new Error(updatedResponse.error);

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? updatedResponse.data : p,
      ),
    }));
  },

  updateProductStatus: async (productId, newStatus) => {
    const { data, error } = await supabase.functions.invoke(
      "products",
      {
        method: "PATCH",
        body: {
          productId,
          status: newStatus,
        },
      },
    );

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    const updated = data.data;

    set((state) => {
      if (state.statusFilter && state.statusFilter !== newStatus) {
        return {
          products: state.products.filter((p) => p.id !== productId),
        };
      }
      return {
        products: state.products.map((p) => (p.id === productId ? updated : p)),
      };
    });
  },
}));
