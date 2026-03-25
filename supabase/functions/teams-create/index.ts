import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { teamsCreateSchema } from "./schema.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";

const supabase = getSupabaseAdmin();

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) throw new Error("Unauthorized");

    const payload = teamsCreateSchema.parse(await req.json());

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
      .upsert({
        id: user.id,
        team_id: team.id,
        display_name: payload.display_name,
      });

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ success: true, team }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
