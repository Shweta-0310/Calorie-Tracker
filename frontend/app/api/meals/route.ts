import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

function getUserId(request: NextRequest): string | null {
  const id = request.headers.get("x-user-id");
  return id && id.trim() ? id.trim() : null;
}

export async function POST(request: NextRequest) {
  const user_id = getUserId(request);
  if (!user_id) {
    return NextResponse.json({ error: "Missing X-User-Id header" }, { status: 401 });
  }

  const { meal_name, calories, protein_g, carbs_g, fats_g, image_url, eaten_at } = await request.json();

  if (!meal_name || calories == null) {
    return NextResponse.json({ error: "meal_name and calories are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meals")
    .insert({
      id: crypto.randomUUID(),
      user_id,
      meal_name,
      calories,
      protein_g: protein_g ?? 0,
      carbs_g: carbs_g ?? 0,
      fats_g: fats_g ?? 0,
      image_url: image_url ?? "",
      eaten_at: eaten_at ?? new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
