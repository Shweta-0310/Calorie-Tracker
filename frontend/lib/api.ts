import { DailySummary, Meal, NutrientData, PeriodSummaryDay } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getUserId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("cal_tracker_user") ?? "";
}

function userHeader(): Record<string, string> {
  const id = getUserId();
  return id ? { "X-User-Id": id } : {};
}

export async function loginUser(username: string): Promise<{ username: string }> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }));
    throw new Error(err.error ?? "Login failed");
  }
  return res.json();
}

export async function analyzeImage(file: File): Promise<NutrientData & { image_url: string }> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/api/analyze`, { method: "POST", headers: userHeader(), body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error ?? "Analysis failed");
  }
  return res.json();
}

export async function saveMeal(data: Omit<Meal, "id" | "created_at">): Promise<Meal> {
  const res = await fetch(`${BASE_URL}/api/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...userHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to save meal" }));
    throw new Error(err.error ?? "Failed to save meal");
  }
  return res.json();
}

export async function getTodaysMeals(): Promise<DailySummary> {
  const res = await fetch(`${BASE_URL}/api/meals/today`, { headers: userHeader() });
  if (!res.ok) throw new Error("Failed to fetch today's meals");
  return res.json();
}

export async function getMealsByDate(date: string): Promise<DailySummary> {
  const res = await fetch(`${BASE_URL}/api/meals/date?date=${date}`, { headers: userHeader() });
  if (!res.ok) throw new Error("Failed to fetch meals for date");
  return res.json();
}

export async function getPeriodSummary(period: "week" | "month"): Promise<PeriodSummaryDay[]> {
  const res = await fetch(`${BASE_URL}/api/meals/summary?period=${period}`, { headers: userHeader() });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function deleteMeal(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/meals/${id}`, { method: "DELETE", headers: userHeader() });
  if (!res.ok) throw new Error("Failed to delete meal");
}
