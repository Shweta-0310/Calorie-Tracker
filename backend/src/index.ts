import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze";
import mealsRouter from "./routes/meals";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"] }));
app.use(express.json());

app.use("/api/analyze", analyzeRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/users", usersRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Cal Tracker API running on http://localhost:${PORT}`);
});
