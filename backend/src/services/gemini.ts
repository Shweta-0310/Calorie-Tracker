import { GoogleGenerativeAI } from "@google/generative-ai";
import { NutrientData } from "../types";

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

export async function analyzeFood(imageBuffer: Buffer, mimeType: string): Promise<NutrientData> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  const result = await model.generateContent([NUTRITION_PROMPT, imagePart]);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  const parsed: NutrientData = JSON.parse(cleaned);

  // Validate required fields
  if (
    typeof parsed.meal_name !== "string" ||
    typeof parsed.calories !== "number" ||
    typeof parsed.protein_g !== "number" ||
    typeof parsed.carbs_g !== "number" ||
    typeof parsed.fats_g !== "number"
  ) {
    throw new Error("Invalid nutrient data structure from Gemini");
  }

  return parsed;
}
