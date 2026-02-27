import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../supabaseClient";

interface AuthState {
  session: Session | null;
  hasTeam: boolean | null;
  teamId: string;
  loading: boolean;
  isRecovery: boolean;

  initialize: () => () => void;
  checkUserTeam: () => Promise<void>;
  setTeam: (teamId: string) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  hasTeam: null,
  teamId: "",
  loading: true,
  isRecovery: false,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        set({ session });
        get().checkUserTeam();
      } else {
        set({ loading: false });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session });

      if (event === "PASSWORD_RECOVERY") {
        set({ isRecovery: true });
      } else if (event === "USER_UPDATED") {
        set({ isRecovery: false });
      }

      if (event === "SIGNED_IN" && session) {
        await get().checkUserTeam();
      } else if (event === "SIGNED_OUT") {
        set({ hasTeam: null, teamId: "", loading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  checkUserTeam: async () => {
    try {
      const { data, error } = await supabase.functions.invoke("auth-get-team");

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      if (data.teamId) {
        set({ teamId: data.teamId, hasTeam: true });
      } else {
        set({ hasTeam: false, teamId: "" });
      }
    } catch (error) {
      console.error("AuthStore (checkUserTeam):", error);
      set({ hasTeam: false });
    } finally {
      set({ loading: false });
    }
  },

  setTeam: (teamId: string) => {
    set({ teamId, hasTeam: true, loading: false });
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
}));
