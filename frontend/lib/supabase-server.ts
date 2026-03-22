import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  }
  return _client;
}

export async function uploadImage(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const client = getSupabase();
  const path = `meals/${Date.now()}-${filename}`;

  const { error } = await client.storage
    .from("meal-images")
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = client.storage.from("meal-images").getPublicUrl(path);
  return data.publicUrl;
}
