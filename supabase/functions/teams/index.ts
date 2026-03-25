import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";
import { getSupabaseAdmin } from "../_shared/supabase.ts";
import {
  createTeamSchema,
  joinTeamSchema,
  fetchTeamSchema,
  manageTeamSchema,
} from "./schemas.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    switch (req.method) {
      case "GET": {
        const { supabase } = await getAppContext(req);

        const url = new URL(req.url);
        const searchParams = Object.fromEntries(url.searchParams.entries());
        const { teamId } = fetchTeamSchema.parse(searchParams);

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
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      case "POST": {
        const supabaseAdmin = getSupabaseAdmin();
        const { user } = await getAppContext(req);
        const body = await req.json();

        if (body.invite_code !== undefined) {
          const payload = joinTeamSchema.parse(body);

          const { data: team, error: teamError } = await supabaseAdmin
            .from("teams")
            .select("*")
            .eq("invite_code", payload.invite_code)
            .single();

          if (teamError || !team)
            throw new Error("Team not found or invalid invite code");

          const { error: profileError } = await supabaseAdmin
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
        } else {
          const payload = createTeamSchema.parse(body);

          const inviteCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

          const { data: team, error: teamError } = await supabaseAdmin
            .from("teams")
            .insert({ name: payload.name, invite_code: inviteCode })
            .select()
            .single();

          if (teamError) throw teamError;

          const { error: profileError } = await supabaseAdmin
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
        }
      }

      case "PATCH":
      case "PUT": {
        // We still check auth for PATCH requests just to ensure validity
        await getAppContext(req);

        const { name } = manageTeamSchema.parse(await req.json());
        const data = {
          message: `Hello ${name}!`,
        };

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
