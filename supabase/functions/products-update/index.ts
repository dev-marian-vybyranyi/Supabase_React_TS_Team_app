import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await getAppContext(req);

    const payload = await req.json();
    const { productId, title, description, imageUrl, removeImage } = payload;

    const updateData: Record<string, unknown> = {
      title,
      description,
    };

    if (imageUrl !== undefined) {
      updateData.image_url = imageUrl;
    } else if (removeImage) {
      updateData.image_url = null;
    }

    const { data: updated, error } = await supabase
      .from("products")
      .update(updateData)
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
