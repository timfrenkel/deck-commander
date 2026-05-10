export type DeckStyle = "aggressive" | "defensive" | "balanced";

export interface MetaDeck {
  name: string;
  style: DeckStyle;
  cards: string[];
  metaWinRate: number;
  metaUsage: number;
  difficulty: number; // 1-5
  synergyScore: number; // 0-100
  counterResistance: number; // 0-100
  averageRecommendedLevel: number;
  goodAgainst: string[];
  badAgainst: string[];
  description: string;
  playstyle: string;
  strengths: string[];
  weaknesses: string[];
  upgradePriority: string[];
}

export interface ScoredDeck extends MetaDeck {
  finalScore: number;
  metaScore: number;
  cardLevelScore: number;
  easeOfUseScore: number;
  averagePlayerLevel: number;
  missingCards: string[];
}

export interface RecommendationResult {
  aggressive: ScoredDeck | null;
  defensive: ScoredDeck | null;
  balanced: ScoredDeck | null;
}