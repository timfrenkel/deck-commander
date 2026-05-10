// Normalize card names for matching (case-insensitive, strip punctuation)
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// CR API returns card levels relative to rarity max. Normalize to "tournament standard" (14).
// Common levels: Common max 14, Rare max 12 -> +2, Epic max 9 -> +5, Legendary max 6 -> +8, Champion max 4 -> +10.
const RARITY_OFFSET: Record<string, number> = {
  common: 0,
  rare: 2,
  epic: 5,
  legendary: 8,
  champion: 10,
};

export function normalizeLevel(level: number, rarity?: string, maxLevel?: number): number {
  if (maxLevel && maxLevel > 0) {
    // level reported is 1-based for that rarity
    const offset = 14 - maxLevel;
    return Math.min(15, level + offset);
  }
  const offset = rarity ? RARITY_OFFSET[rarity.toLowerCase()] ?? 0 : 0;
  return Math.min(15, level + offset);
}

export function cardSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cardIconUrl(name: string): string {
  return `https://cdn.royaleapi.com/static/img/cards-150/${cardSlug(name)}.png`;
}