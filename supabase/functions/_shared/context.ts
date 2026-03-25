import { User, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { requireAuth } from "./auth.ts";
import { getSupabaseClient } from "./supabase.ts";

export interface AppContext {
  user: User;
  supabase: SupabaseClient;
}

export const getAppContext = async (req: Request): Promise<AppContext> => {
  const user = await requireAuth(req);
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const supabase = getSupabaseClient(authHeader);

  return { user, supabase };
};
