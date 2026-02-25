import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) throw new Error("Unauthorized");

    const { action, payload } = await req.json();

    if (action === "create") {
      const inviteCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({ name: payload.name, invite_code: inviteCode })
        .select()
        .single();

      if (teamError) throw teamError;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, team_id: team.id });

      if (profileError) throw profileError;

      return new Response(JSON.stringify({ success: true, team }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "join") {
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("invite_code", payload.invite_code)
        .single();

      if (teamError || !team)
        throw new Error("Team not found or invalid invite code");

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, team_id: team.id });

      if (profileError) throw profileError;

      return new Response(JSON.stringify({ success: true, team }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unknown action");
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
