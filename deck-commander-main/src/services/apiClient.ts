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

// Leerer Wert => same-origin (Frontend wird vom selben Express ausgeliefert).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export async function analyzePlayerViaApi(tag: string): Promise<AnalyzeResponse> {
  const url = `${API_BASE_URL}/api/player/${encodeURIComponent(tag)}`;
  const response = await fetch(url);
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
