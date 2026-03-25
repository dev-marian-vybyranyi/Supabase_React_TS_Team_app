import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await getAppContext(req);

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
