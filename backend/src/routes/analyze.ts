import { Router, Request, Response } from "express";
import multer from "multer";
import { analyzeFood } from "../services/gemini";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

router.post("/", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  try {
    const nutrients = await analyzeFood(req.file.buffer, req.file.mimetype);
    res.json({ ...nutrients, image_url: "" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    res.status(500).json({ error: message });
  }
});

export default router;
