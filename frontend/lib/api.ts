import { DailySummary, Meal, NutrientData, PeriodSummaryDay } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function analyzeImage(file: File): Promise<NutrientData & { image_url: string }> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/api/analyze`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error ?? "Analysis failed");
  }
  return res.json();
}

export async function saveMeal(data: Omit<Meal, "id" | "created_at">): Promise<Meal> {
  const res = await fetch(`${BASE_URL}/api/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to save meal" }));
    throw new Error(err.error ?? "Failed to save meal");
  }
  return res.json();
}

export async function getTodaysMeals(): Promise<DailySummary> {
  const res = await fetch(`${BASE_URL}/api/meals/today`);
  if (!res.ok) throw new Error("Failed to fetch today's meals");
  return res.json();
}

export async function getPeriodSummary(period: "week" | "month"): Promise<PeriodSummaryDay[]> {
  const res = await fetch(`${BASE_URL}/api/meals/summary?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function deleteMeal(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/meals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete meal");
}
