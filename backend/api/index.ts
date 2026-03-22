import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "../src/routes/analyze";
import mealsRouter from "../src/routes/meals";
import usersRouter from "../src/routes/users";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/analyze", analyzeRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/users", usersRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
