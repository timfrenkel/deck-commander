import { Router } from "express";
import { fetchPlayer, mockPlayer, normalizeTag } from "../services/clashApi.js";
import type { AnalyzeApiResponse } from "../types.js";

const TAG_PATTERN = /^#?[0289PYLQGRJCUV]+$/i;

const router = Router();

router.get("/:tag", async (req, res) => {
  const tag = normalizeTag(req.params.tag);
  if (tag.length < 3 || tag.length > 16 || !TAG_PATTERN.test(tag)) {
    res.status(400).json({ error: "Ungueltiges Tag-Format" });
    return;
  }

  const apiKey = process.env.CLASH_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "CLASH_API_KEY ist nicht gesetzt" });
    return;
  }

  try {
    const player = await fetchPlayer(tag, apiKey);
    const payload: AnalyzeApiResponse = { player, usedMock: false };
    res.json(payload);
  } catch (error) {
    const warning = error instanceof Error ? error.message : "Spielerdaten konnten nicht geladen werden";
    const payload: AnalyzeApiResponse = {
      player: mockPlayer(tag),
      usedMock: true,
      warning,
    };
    res.json(payload);
  }
});

export default router;
