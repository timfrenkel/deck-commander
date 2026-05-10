import type { Player } from "../types.js";

const BASE = "https://api.clashroyale.com/v1";

const RARITY_OFFSET: Record<string, number> = {
  common: 0,
  rare: 2,
  epic: 5,
  legendary: 8,
  champion: 10,
};

export function normalizeTag(tag: string): string {
  let value = tag.trim().toUpperCase().replace(/O/g, "0");
  if (!value.startsWith("#")) value = `#${value}`;
  return value;
}

function normalizeLevel(level: number, rarity?: string, maxLevel?: number): number {
  if (maxLevel && maxLevel > 0) {
    const offset = 14 - maxLevel;
    return Math.min(15, level + offset);
  }
  const offset = rarity ? RARITY_OFFSET[rarity.toLowerCase()] ?? 0 : 0;
  return Math.min(15, level + offset);
}

export async function fetchPlayer(rawTag: string, apiKey: string): Promise<Player> {
  const tag = normalizeTag(rawTag);
  const encoded = encodeURIComponent(tag);
  const response = await fetch(`${BASE}/players/${encoded}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Clash API ${response.status}: ${message || response.statusText}`);
  }

  const data = await response.json();

  return {
    tag: data.tag,
    name: data.name,
    expLevel: data.expLevel,
    trophies: data.trophies,
    bestTrophies: data.bestTrophies,
    arena: data.arena ? { name: data.arena.name } : undefined,
    clan: data.clan ? { name: data.clan.name } : undefined,
    cards: (data.cards ?? []).map((card: any) => ({
      name: card.name,
      id: card.id,
      level: normalizeLevel(card.level, card.rarity, card.maxLevel),
      maxLevel: card.maxLevel,
      rarity: card.rarity,
      iconUrls: card.iconUrls,
    })),
  };
}

export function mockPlayer(tag: string): Player {
  const cardNames = [
    "Hog Rider", "Fireball", "Ice Spirit", "Skeletons", "Cannon", "Musketeer", "The Log", "Ice Golem",
    "Miner", "Poison", "Bats", "Inferno Tower", "Bandit", "Royal Hogs", "Earthquake", "Flying Machine",
    "Barbarian Barrel", "Royal Delivery", "Zappies", "Fisherman", "Mega Knight", "Lava Hound", "Balloon",
    "Zap", "Mega Minion", "Tombstone", "Skeleton Dragons", "Mortar", "Goblin Barrel", "Knight", "Princess",
    "Rocket", "X-Bow", "Tesla", "Archers", "Royal Giant", "Mighty Miner", "Lightning", "Phoenix", "Hunter",
    "Graveyard", "Baby Dragon", "Tornado", "Bowler", "Ice Wizard", "Golem", "Night Witch", "Elixir Collector",
    "P.E.K.K.A", "Battle Ram", "Royal Ghost", "Magic Archer", "Electro Wizard", "Giant", "Prince", "Dark Prince",
    "Witch", "Mini P.E.K.K.A", "Electro Giant", "Sparky",
  ];

  return {
    tag: normalizeTag(tag),
    name: "Mock Player",
    expLevel: 50,
    trophies: 6500,
    bestTrophies: 7200,
    arena: { name: "Legendary Arena" },
    cards: cardNames.map((name) => ({ name, level: 13 })),
  };
}
