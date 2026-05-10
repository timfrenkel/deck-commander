import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = Number(process.env.PORT || 3000);

// ----------------------
// API IMPORT (dein bestehendes Backend)
// ----------------------
import "./server"; // falls deine API hier registriert wird

// ----------------------
// FRONTEND STATIC
// ----------------------
const clientPath = path.resolve("dist/client");

if (!fs.existsSync(clientPath)) {
  console.warn("⚠️ dist/client nicht gefunden – Frontend fehlt!");
}

app.use(express.static(clientPath));

// SPA fallback
app.get("*", (_, res) => {
  const indexPath = path.join(clientPath, "index.html");

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend not built (missing index.html)");
  }
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server läuft auf http://0.0.0.0:${PORT}`);
});
