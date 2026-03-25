import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCorsAndMethod } from "../_shared/cors.ts";
import { getAppContext } from "../_shared/context.ts";

Deno.serve(async (req) => {
  const earlyResponse = handleCorsAndMethod(req);
  if (earlyResponse) return earlyResponse;

  try {
    const { supabase, user } = await getAppContext(req);

    const payload = await req.json();
    const {
      teamId,
      page = 1,
      pageSize = 6,
      statusFilter,
      sortOrder = "newest",
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
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
