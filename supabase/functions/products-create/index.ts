import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { supabase, user } = await requireAuth(req);

    const payload = await req.json();
    const { title, description, teamId, imageUrl } = payload;

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert({
        title,
        description,
        image_url: imageUrl,
        team_id: teamId,
        created_by: user.id,
      })
      .select("*, profiles!created_by(display_name)")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data: newProduct }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
