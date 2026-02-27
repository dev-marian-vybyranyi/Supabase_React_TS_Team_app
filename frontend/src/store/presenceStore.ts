import { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../supabaseClient";

interface PresenceState {
  onlineUserIds: string[];
  channel: RealtimeChannel | null;
  initializePresence: (teamId: string, currentUserId: string) => void;
  cleanupPresence: () => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUserIds: [],
  channel: null,
  initializePresence: (teamId, currentUserId) => {
    const existingChannel = get().channel;
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const roomName = `presence:team-${teamId}`;

    const channel = supabase.channel(roomName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const activeIds = Object.keys(state);
        set({ onlineUserIds: activeIds });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    set({ channel });
  },

  cleanupPresence: () => {
    const { channel } = get();
    if (channel) {
      supabase.removeChannel(channel);
    }
    set({ channel: null, onlineUserIds: [] });
  },
}));
