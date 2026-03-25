import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const clients = new Map<string, SupabaseClient>();
let adminClient: SupabaseClient | null = null;

export const getSupabaseClient = (authHeader: string): SupabaseClient => {
  let supabase = clients.get(authHeader);
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    clients.set(authHeader, supabase);
  }
  return supabase;
};

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return adminClient;
};
