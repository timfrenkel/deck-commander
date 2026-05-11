import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchPlayer, mockPlayer, normalizeTag } from "@/services/clashApi.server";
import { recommendDecks } from "@/services/recommendationEngine";
import type { Player } from "@/types/player";
import type { RecommendationResult } from "@/types/deck";

const InputSchema = z.object({
  tag: z
    .string()
    .trim()
    .min(3)
    .max(16)
    .regex(/^#?[0289PYLQGRJCUV]+$/i, "Ungültiges Tag-Format"),
});

export interface AnalyzeResponse {
  player: Player;
  recommendations: RecommendationResult;
  usedMock: boolean;
  warning?: string;
}

export const analyzePlayer = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => InputSchema.parse(raw))
  .handler(async ({ data }): Promise<AnalyzeResponse> => {
    const tag = normalizeTag(data.tag);
    try {
      const player = await fetchPlayer(tag);
      return {
        player,
        recommendations: recommendDecks(player),
        usedMock: false,
      };
    } catch (err) {
      console.error("[analyzePlayer] falling back to mock:", err);
      const player = mockPlayer(tag);
      return {
        player,
        recommendations: recommendDecks(player),
        usedMock: true,
        warning:
          err instanceof Error ? err.message : "Spielerdaten konnten nicht geladen werden.",
      };
    }
  });