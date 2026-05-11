import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import playerRoutes from "./routes/player.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// ---------- API ----------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/player", playerRoutes);

// ---------- Static frontend ----------
// dist/server/standalone.js -> ../../dist/client
const clientDir = path.resolve(__dirname, "../client");

if (!fs.existsSync(clientDir)) {
  console.warn(`[standalone] dist/client nicht gefunden unter ${clientDir} – baue zuerst das Frontend mit "npm run build".`);
}

app.use(express.static(clientDir));

// SPA fallback for any non-API route
app.get(/^\/(?!api\/).*/, (_req, res) => {
  const indexPath = path.join(clientDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend nicht gebaut (dist/client/index.html fehlt). Bitte 'npm run build' ausführen.");
  }
});

app.listen(port, host, () => {
  console.log(`Deck Commander läuft auf http://${host}:${port}`);
  console.log(`  API:      /api/health, /api/player/:tag`);
  console.log(`  Frontend: ${clientDir}`);
});