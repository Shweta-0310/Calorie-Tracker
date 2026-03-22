import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user_id = request.headers.get("x-user-id")?.trim();
  if (!user_id) {
    return NextResponse.json({ error: "Missing X-User-Id header" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
