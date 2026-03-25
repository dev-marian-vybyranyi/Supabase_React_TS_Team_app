import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";
import {
  createProductSchema,
  fetchProductsSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "./schemas.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { supabase, user } = await getAppContext(req);

    switch (req.method) {
      case "GET": {
        const url = new URL(req.url);
        const searchParams = Object.fromEntries(url.searchParams.entries());
        
        const payload = fetchProductsSchema.parse({
          ...searchParams,
          page: searchParams.page ? parseInt(searchParams.page, 10) : undefined,
          pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize, 10) : undefined,
        });

        const {
          teamId,
          page,
          pageSize,
          statusFilter,
          sortOrder,
          userFilter,
          searchQuery,
        } = payload;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
          .from("products")
          .select("*, profiles!created_by(display_name)", { count: "exact" })
          .eq("team_id", teamId)
          .order("created_at", { ascending: sortOrder === "oldest" })
          .range(from, to);

        if (statusFilter) {
          query = query.eq("status", statusFilter);
        }

        if (userFilter) {
          query = query.eq("created_by", userFilter);
        }

        if (searchQuery) {
          query = query.textSearch("fts", searchQuery, {
            type: "websearch",
            config: "english",
          });
        }

        const { data, error, count } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ success: true, data, count }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "POST": {
        const payload = createProductSchema.parse(await req.json());
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

        return new Response(
          JSON.stringify({ success: true, data: newProduct }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      case "PATCH":
      case "PUT": {
        const body = await req.json();
        
        if (body.status !== undefined && body.title === undefined && body.description === undefined) {
          const payload = updateProductStatusSchema.parse(body);
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
        } else {
          const payload = updateProductSchema.parse(body);
          const { productId, title, description, imageUrl, removeImage } = payload;

          const updateData: Record<string, unknown> = {};
          if (title !== undefined) updateData.title = title;
          if (description !== undefined) updateData.description = description;

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
        }
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
