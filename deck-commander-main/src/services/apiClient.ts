import type { RecommendationResult } from "@/types/deck";
import type { Player } from "@/types/player";
import { recommendDecks } from "@/services/recommendationEngine";

interface AnalyzeApiResponse {
  player: Player;
  usedMock: boolean;
  warning?: string;
}

export interface AnalyzeResponse extends AnalyzeApiResponse {
  recommendations: RecommendationResult;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function analyzePlayerViaApi(tag: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/player/${encodeURIComponent(tag)}`);
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `API Fehler ${response.status}`);
  }

  const payload = (await response.json()) as AnalyzeApiResponse;
  return {
    ...payload,
    recommendations: recommendDecks(payload.player),
  };
}
