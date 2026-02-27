import type { Profile, Team } from "@/types/team.types";
import { create } from "zustand";
import { supabase } from "../supabaseClient";

interface TeamState {
  team: Team | null;
  members: Profile[];
  isLoading: boolean;
  error: string | null;

  fetchTeamData: (teamId: string) => Promise<void>;
  clearTeamData: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  team: null,
  members: [],
  isLoading: false,
  error: null,

  fetchTeamData: async (teamId: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .maybeSingle();

      if (teamError) throw teamError;

      const { data: membersData, error: membersError } = await supabase
        .from("profiles")
        .select("*")
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      set({
        team: teamData,
        members: membersData || [],
        isLoading: false,
      });
    } catch (error: unknown) {
      console.error("TeamStore (fetchTeamData):", error);

      let errorMessage = "Error fetching team data";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  clearTeamData: () => set({ team: null, members: [], error: null }),
}));
