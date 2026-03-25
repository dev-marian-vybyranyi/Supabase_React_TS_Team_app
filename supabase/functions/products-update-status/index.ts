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
