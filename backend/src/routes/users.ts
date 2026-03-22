import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";

const router = Router();

// POST /api/users/login — upsert a user by username
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  if (!username || typeof username !== "string" || !username.trim()) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  const name = username.trim().toLowerCase();

  const { data, error } = await supabase
    .from("users")
    .upsert({ username: name }, { onConflict: "username" })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});

export default router;
