import metaDecksRaw from "@/data/metaDecks.json";
import type { DeckStyle, MetaDeck, RecommendationResult, ScoredDeck } from "@/types/deck";
import type { Player } from "@/types/player";
import { sharedCardCount } from "@/utils/similarityCheck";
import { buildPlayerLookup, scoreDeck } from "./scoringEngine";

const META_DECKS = metaDecksRaw as MetaDeck[];

export function recommendDecks(player: Player): RecommendationResult {
  const lookup = buildPlayerLookup(player.cards);

  // Filter: must own all cards (strict). If too few decks pass, relax to >=6 cards owned.
  const fullyOwned = META_DECKS.filter((d) => d.cards.every((c) => lookup.has(c)));
  const candidates =
    fullyOwned.length >= 3
      ? fullyOwned
      : META_DECKS.filter((d) => d.cards.filter((c) => lookup.has(c)).length >= 6);

  const scored = candidates.map((d) => scoreDeck(d, lookup));

  const pickByStyle = (style: DeckStyle, exclude: ScoredDeck[]): ScoredDeck | null => {
    const sorted = scored
      .filter((d) => d.style === style)
      .sort((a, b) => b.finalScore - a.finalScore);
    for (const d of sorted) {
      const tooSimilar = exclude.some((e) => sharedCardCount(e.cards, d.cards) > 5);
      if (!tooSimilar) return d;
    }
    return sorted[0] ?? null;
  };

  const aggressive = pickByStyle("aggressive", []);
  const defensive = pickByStyle("defensive", aggressive ? [aggressive] : []);
  const picked = [aggressive, defensive].filter(Boolean) as ScoredDeck[];
  const balanced = pickByStyle("balanced", picked);

  return { aggressive, defensive, balanced };
}