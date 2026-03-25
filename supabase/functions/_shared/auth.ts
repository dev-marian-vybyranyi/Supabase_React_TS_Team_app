import { SupabaseClient, User } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getSupabaseClient } from "./supabase.ts";

interface AuthContext {
  supabase: SupabaseClient;
  user: User;
}

export const requireAuth = async (req: Request): Promise<AuthContext> => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const supabase = getSupabaseClient(authHeader);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

  if (userError || !user) throw new Error("Unauthorized");

  return { supabase, user };
};
