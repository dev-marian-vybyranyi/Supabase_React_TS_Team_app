import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await requireAuth(req);

    const payload = await req.json();
    const { teamId } = payload;

    if (!teamId) {
      throw new Error("Missing teamId");
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        team: teamData,
        members: membersData || [],
      }),
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
