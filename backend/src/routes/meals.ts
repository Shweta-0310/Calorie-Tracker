import { Router, Request, Response } from "express";
import { Meal, DailySummary, PeriodSummaryDay } from "../types";

const router = Router();

// In-memory store (temporary, no Supabase)
const mealsStore: Meal[] = [];

// POST /api/meals — save a meal
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { meal_name, calories, protein_g, carbs_g, fats_g, image_url, eaten_at } = req.body;

  if (!meal_name || calories == null) {
    res.status(400).json({ error: "meal_name and calories are required" });
    return;
  }

  const meal: Meal = {
    id: Math.random().toString(36).slice(2),
    meal_name,
    calories,
    protein_g: protein_g ?? 0,
    carbs_g: carbs_g ?? 0,
    fats_g: fats_g ?? 0,
    image_url: image_url ?? "",
    eaten_at: eaten_at ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  mealsStore.push(meal);
  res.status(201).json(meal);
});

// GET /api/meals/today — fetch today's meals + daily totals
router.get("/today", async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();

  const meals = mealsStore.filter((m) => {
    const t = new Date(m.eaten_at).getTime();
    return t >= startOfDay && t < endOfDay;
  });

  const summary: DailySummary = {
    meals,
    total_calories: meals.reduce((sum, m) => sum + (m.calories ?? 0), 0),
    total_protein_g: meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0),
    total_carbs_g: meals.reduce((sum, m) => sum + (m.carbs_g ?? 0), 0),
    total_fats_g: meals.reduce((sum, m) => sum + (m.fats_g ?? 0), 0),
  };

  res.json(summary);
});

// GET /api/meals/summary?period=week|month
router.get("/summary", async (req: Request, res: Response): Promise<void> => {
  const period = req.query.period === "month" ? "month" : "week";
  const days = period === "month" ? 30 : 7;

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const filtered = mealsStore.filter((m) => new Date(m.eaten_at) >= since);

  const grouped: Record<string, PeriodSummaryDay> = {};
  for (const row of filtered) {
    const date = row.eaten_at.slice(0, 10);
    if (!grouped[date]) {
      grouped[date] = { date, total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fats_g: 0 };
    }
    grouped[date].total_calories += row.calories ?? 0;
    grouped[date].total_protein_g += row.protein_g ?? 0;
    grouped[date].total_carbs_g += row.carbs_g ?? 0;
    grouped[date].total_fats_g += row.fats_g ?? 0;
  }

  res.json(Object.values(grouped));
});

// DELETE /api/meals/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const idx = mealsStore.findIndex((m) => m.id === id);
  if (idx !== -1) mealsStore.splice(idx, 1);
  res.json({ success: true });
});

export default router;
