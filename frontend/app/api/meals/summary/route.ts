import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const user_id = request.headers.get("x-user-id")?.trim();
  if (!user_id) {
    return NextResponse.json({ error: "Missing X-User-Id header" }, { status: 401 });
  }

  const period = new URL(request.url).searchParams.get("period") === "month" ? "month" : "week";
  const days = period === "month" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("eaten_at", since.toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const grouped: Record<string, any> = {};
  for (const row of data ?? []) {
    const date = row.eaten_at.slice(0, 10);
    if (!grouped[date]) {
      grouped[date] = { date, total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fats_g: 0 };
    }
    grouped[date].total_calories += row.calories ?? 0;
    grouped[date].total_protein_g += row.protein_g ?? 0;
    grouped[date].total_carbs_g += row.carbs_g ?? 0;
    grouped[date].total_fats_g += row.fats_g ?? 0;
  }

  return NextResponse.json(Object.values(grouped));
}
