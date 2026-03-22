import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { DailySummary, PeriodSummaryDay } from "../types";

const router = Router();

function getUserId(req: Request): string | null {
  const id = req.headers["x-user-id"];
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function buildSummary(meals: any[]): DailySummary {
  return {
    meals,
    total_calories: meals.reduce((s, m) => s + (m.calories ?? 0), 0),
    total_protein_g: meals.reduce((s, m) => s + (m.protein_g ?? 0), 0),
    total_carbs_g: meals.reduce((s, m) => s + (m.carbs_g ?? 0), 0),
    total_fats_g: meals.reduce((s, m) => s + (m.fats_g ?? 0), 0),
  };
}

// POST /api/meals — save a meal
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const user_id = getUserId(req);
  if (!user_id) { res.status(401).json({ error: "Missing X-User-Id header" }); return; }

  const { meal_name, calories, protein_g, carbs_g, fats_g, image_url, eaten_at } = req.body;
  if (!meal_name || calories == null) {
    res.status(400).json({ error: "meal_name and calories are required" });
    return;
  }

  const { data, error } = await supabase.from("meals").insert({
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
  }).select().single();

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json(data);
});

// GET /api/meals/today
router.get("/today", async (req: Request, res: Response): Promise<void> => {
  const user_id = getUserId(req);
  if (!user_id) { res.status(401).json({ error: "Missing X-User-Id header" }); return; }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("eaten_at", start)
    .lt("eaten_at", end)
    .order("eaten_at", { ascending: true });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(buildSummary(data ?? []));
});

// GET /api/meals/date?date=YYYY-MM-DD
router.get("/date", async (req: Request, res: Response): Promise<void> => {
  const user_id = getUserId(req);
  if (!user_id) { res.status(401).json({ error: "Missing X-User-Id header" }); return; }

  const dateStr = req.query.date as string;
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({ error: "date query param must be YYYY-MM-DD" });
    return;
  }

  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("eaten_at", start)
    .lt("eaten_at", end)
    .order("eaten_at", { ascending: true });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(buildSummary(data ?? []));
});

// GET /api/meals/summary?period=week|month
router.get("/summary", async (req: Request, res: Response): Promise<void> => {
  const user_id = getUserId(req);
  if (!user_id) { res.status(401).json({ error: "Missing X-User-Id header" }); return; }

  const period = req.query.period === "month" ? "month" : "week";
  const days = period === "month" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("eaten_at", since.toISOString());

  if (error) { res.status(500).json({ error: error.message }); return; }

  const grouped: Record<string, PeriodSummaryDay> = {};
  for (const row of data ?? []) {
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
  const user_id = getUserId(req);
  if (!user_id) { res.status(401).json({ error: "Missing X-User-Id header" }); return; }

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", user_id);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ success: true });
});

export default router;
