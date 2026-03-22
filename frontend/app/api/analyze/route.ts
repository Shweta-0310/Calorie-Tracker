import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadImage } from "@/lib/supabase-server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const NUTRITION_PROMPT = `You are a nutrition expert. Analyze this food image and return ONLY a valid JSON object with no markdown, no code blocks, no explanation. Just the raw JSON:
{
  "meal_name": "descriptive name of the food",
  "calories": <number in kcal>,
  "protein_g": <number in grams>,
  "carbs_g": <number in grams>,
  "fats_g": <number in grams>
}
Estimate reasonable portion sizes if not clearly visible. All numeric values must be numbers, not strings.`;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagePart = { inlineData: { data: buffer.toString("base64"), mimeType: file.type } };

    const [result, image_url] = await Promise.all([
      model.generateContent([NUTRITION_PROMPT, imagePart]),
      uploadImage(buffer, file.name, file.type),
    ]);

    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const nutrients = JSON.parse(cleaned);

    return NextResponse.json({ ...nutrients, image_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
