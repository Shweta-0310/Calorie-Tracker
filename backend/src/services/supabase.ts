import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function uploadImage(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const path = `meals/${Date.now()}-${filename}`;

  const { error } = await supabase.storage
    .from("meal-images")
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from("meal-images").getPublicUrl(path);
  return data.publicUrl;
}
