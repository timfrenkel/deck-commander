export interface PlayerCard {
  name: string;
  id?: number;
  level: number;
  maxLevel?: number;
  rarity?: string;
  iconUrls?: { medium?: string };
}

export interface Player {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies?: number;
  arena?: { name: string };
  clan?: { name: string };
  cards: PlayerCard[];
}

export interface AnalyzeApiResponse {
  player: Player;
  usedMock: boolean;
  warning?: string;
}
