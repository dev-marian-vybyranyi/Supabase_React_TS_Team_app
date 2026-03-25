import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await requireAuth(req);

    const { data, error } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, teamId: data?.team_id || null }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
