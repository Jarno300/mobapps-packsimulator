import { Card } from "@/api/fetchCards";

const cardCache: Card[] = [];

export async function initExpansionCache(cards: Card[]): Promise<void> {
  if (!cards || !Array.isArray(cards)) {
    console.error("initExpansionCache received invalid cards:", cards);
    throw new Error("initExpansionCache: cards must be a valid array");
  }
  console.log(
    "initExpansionCache: Adding",
    cards.length,
    "cards to cache. Current cache size:",
    cardCache.length
  );
  cardCache.length = 0; // Clear existing cache
  cardCache.push(...cards);
  console.log("initExpansionCache: Cache now has", cardCache.length, "cards");
}

export function getCardCache(): Card[] {
  return cardCache;
}
