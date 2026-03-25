import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await getAppContext(req);

    const payload = await req.json();
    const { productId, status } = payload;
    const now = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from("products")
      .update({
        status,
        updated_at: now,
      })
      .eq("id", productId)
      .select("*, profiles!created_by(display_name)")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data: updated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
