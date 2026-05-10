export interface PlayerCard {
  name: string;
  id?: number;
  level: number; // normalized to max-14 scale
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