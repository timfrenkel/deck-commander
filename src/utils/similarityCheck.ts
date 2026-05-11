import { normalizeName } from "./normalizeCards";

export function sharedCardCount(a: string[], b: string[]): number {
  const setA = new Set(a.map(normalizeName));
  let count = 0;
  for (const c of b) if (setA.has(normalizeName(c))) count++;
  return count;
}