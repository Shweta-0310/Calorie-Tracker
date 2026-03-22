import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

function buildSummary(meals: any[]) {
  return {
    meals,
    total_calories: meals.reduce((s, m) => s + (m.calories ?? 0), 0),
    total_protein_g: meals.reduce((s, m) => s + (m.protein_g ?? 0), 0),
    total_carbs_g: meals.reduce((s, m) => s + (m.carbs_g ?? 0), 0),
    total_fats_g: meals.reduce((s, m) => s + (m.fats_g ?? 0), 0),
  };
}

export async function GET(request: NextRequest) {
  const user_id = request.headers.get("x-user-id")?.trim();
  if (!user_id) {
    return NextResponse.json({ error: "Missing X-User-Id header" }, { status: 401 });
  }

  const dateStr = new URL(request.url).searchParams.get("date");
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "date query param must be YYYY-MM-DD" }, { status: 400 });
  }

  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("eaten_at", start)
    .lt("eaten_at", end)
    .order("eaten_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(buildSummary(data ?? []));
}
