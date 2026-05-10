import type { Player, PlayerCard } from "@/types/player";
import { normalizeLevel } from "@/utils/normalizeCards";

const BASE = "https://api.clashroyale.com/v1";

export function normalizeTag(tag: string): string {
  let t = tag.trim().toUpperCase().replace(/O/g, "0");
  if (!t.startsWith("#")) t = `#${t}`;
  return t;
}

export async function fetchPlayer(rawTag: string): Promise<Player> {
  const apiKey = process.env.CLASH_API_KEY;
  if (!apiKey) throw new Error("CLASH_API_KEY is not configured");

  const tag = normalizeTag(rawTag);
  const encoded = encodeURIComponent(tag);
  const res = await fetch(`${BASE}/players/${encoded}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Clash API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  const cards: PlayerCard[] = (data.cards ?? []).map((c: any) => ({
    name: c.name,
    id: c.id,
    level: normalizeLevel(c.level, c.rarity, c.maxLevel),
    maxLevel: c.maxLevel,
    rarity: c.rarity,
    iconUrls: c.iconUrls,
  }));

  return {
    tag: data.tag,
    name: data.name,
    expLevel: data.expLevel,
    trophies: data.trophies,
    bestTrophies: data.bestTrophies,
    arena: data.arena ? { name: data.arena.name } : undefined,
    clan: data.clan ? { name: data.clan.name } : undefined,
    cards,
  };
}

export function mockPlayer(tag: string): Player {
  // All cards from the meta decks union, leveled around 13
  const cardNames = [
    "Hog Rider","Fireball","Ice Spirit","Skeletons","Cannon","Musketeer","The Log","Ice Golem",
    "Miner","Poison","Bats","Inferno Tower","Bandit","Royal Hogs","Earthquake","Flying Machine",
    "Barbarian Barrel","Royal Delivery","Zappies","Fisherman","Mega Knight","Lava Hound","Balloon",
    "Zap","Mega Minion","Tombstone","Skeleton Dragons","Mortar","Goblin Barrel","Knight","Princess",
    "Rocket","X-Bow","Tesla","Archers","Royal Giant","Mighty Miner","Lightning","Phoenix","Hunter",
    "Graveyard","Baby Dragon","Tornado","Bowler","Ice Wizard","Golem","Night Witch","Elixir Collector",
    "P.E.K.K.A","Battle Ram","Royal Ghost","Magic Archer","Electro Wizard","Giant","Prince","Dark Prince",
    "Witch","Mini P.E.K.K.A","Electro Giant","Sparky",
  ];
  return {
    tag: tag,
    name: "Mock Player",
    expLevel: 50,
    trophies: 6500,
    bestTrophies: 7200,
    arena: { name: "Legendary Arena" },
    cards: cardNames.map((name) => ({ name, level: 13 })),
  };
}