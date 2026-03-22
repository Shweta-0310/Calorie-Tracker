import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const { username } = await request.json();

  if (!username || typeof username !== "string" || !username.trim()) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const name = username.trim().toLowerCase();

  const { data, error } = await supabase
    .from("users")
    .upsert({ username: name }, { onConflict: "username" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
