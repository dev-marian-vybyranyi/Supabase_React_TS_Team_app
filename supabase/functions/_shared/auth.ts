import { User } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getSupabaseClient } from "./supabase.ts";

export const requireAuth = async (req: Request): Promise<User> => {
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

  return user;
};
