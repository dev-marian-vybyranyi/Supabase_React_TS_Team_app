import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../supabaseClient";

interface AuthState {
  session: Session | null;
  hasTeam: boolean | null;
  teamId: string;
  loading: boolean;

  initialize: () => () => void;
  checkUserTeam: (userId: string) => Promise<void>;
  setTeam: (teamId: string) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hasTeam: null,
  teamId: "",
  loading: true,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session });
      if (session) {
        useAuthStore.getState().checkUserTeam(session.user.id);
      } else {
        set({ loading: false });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        set({ session });
        if (session) {
          useAuthStore.getState().checkUserTeam(session.user.id);
        } else {
          set({ hasTeam: null, teamId: "", loading: false });
        }
      }
    });

    return () => subscription.unsubscribe();
  },

  checkUserTeam: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking user team:", error);
      }

      if (data && data.team_id) {
        set({ teamId: data.team_id, hasTeam: true });
      } else {
        set({ hasTeam: false });
      }
    } catch (error) {
      console.error(error);
      set({ hasTeam: false });
    } finally {
      set({ loading: false });
    }
  },

  setTeam: (teamId: string) => {
    set({ teamId, hasTeam: true, loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
