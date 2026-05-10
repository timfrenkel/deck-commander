import type { MetaDeck, ScoredDeck } from "@/types/deck";
import type { PlayerCard } from "@/types/player";
import { average } from "@/utils/calculateAverage";
import { normalizeName } from "@/utils/normalizeCards";

const WIN_CONDITIONS = new Set(
  [
    "Hog Rider",
    "Balloon",
    "Golem",
    "X-Bow",
    "Mortar",
    "Royal Giant",
    "Giant",
    "Lava Hound",
    "Miner",
    "Graveyard",
    "P.E.K.K.A",
    "Electro Giant",
    "Royal Hogs",
    "Goblin Barrel",
    "Battle Ram",
  ].map(normalizeName),
);

export interface PlayerCardLookup {
  has: (cardName: string) => boolean;
  level: (cardName: string) => number | null;
}

export function buildPlayerLookup(cards: PlayerCard[]): PlayerCardLookup {
  const map = new Map<string, number>();
  for (const c of cards) map.set(normalizeName(c.name), c.level);
  return {
    has: (name) => map.has(normalizeName(name)),
    level: (name) => map.get(normalizeName(name)) ?? null,
  };
}

export function metaScore(deck: MetaDeck): number {
  // 0-100ish range
  return deck.metaWinRate * 0.7 + deck.metaUsage * 0.3 * 5; // boost usage weight visually
}

export function cardLevelScore(deck: MetaDeck, lookup: PlayerCardLookup): { score: number; avg: number; missing: string[] } {
  const levels: number[] = [];
  const missing: string[] = [];
  let winConditionPenalty = 0;

  for (const card of deck.cards) {
    const lvl = lookup.level(card);
    if (lvl == null) {
      missing.push(card);
      continue;
    }
    levels.push(lvl);
    if (WIN_CONDITIONS.has(normalizeName(card))) {
      const diff = deck.averageRecommendedLevel - lvl;
      if (diff >= 2) winConditionPenalty += diff * 8;
    }
  }

  if (levels.length === 0) {
    return { score: 0, avg: 0, missing };
  }

  const avg = average(levels);
  const ratio = avg / deck.averageRecommendedLevel;
  const base = Math.min(1.1, ratio) * 100;
  return { score: Math.max(0, base - winConditionPenalty), avg, missing };
}

export function easeOfUseScore(deck: MetaDeck): number {
  // difficulty 1 -> 100, difficulty 5 -> 20
  return 100 - (deck.difficulty - 1) * 20;
}

export function scoreDeck(deck: MetaDeck, lookup: PlayerCardLookup): ScoredDeck {
  const ms = metaScore(deck);
  const cls = cardLevelScore(deck, lookup);
  const eus = easeOfUseScore(deck);
  const crs = deck.counterResistance;

  const final =
    ms * 0.35 + cls.score * 0.35 + deck.synergyScore * 0.15 + eus * 0.1 + crs * 0.05;

  return {
    ...deck,
    metaScore: ms,
    cardLevelScore: cls.score,
    easeOfUseScore: eus,
    averagePlayerLevel: cls.avg,
    missingCards: cls.missing,
    finalScore: final,
  };
}