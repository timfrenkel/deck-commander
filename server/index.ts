import "dotenv/config";
import cors from "cors";
import express from "express";
import playerRoutes from "./routes/player.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/player", playerRoutes);

app.listen(port, host, () => {
  console.log(`API server running on http://${host}:${port}`);
});
