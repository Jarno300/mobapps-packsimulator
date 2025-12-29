import { Card } from "@/api/fetchCards";

const cardCache: Card[] = [];

export async function initExpansionCache(cards: Card[]): Promise<void> {
  if (!cards || !Array.isArray(cards)) {
    console.error("initExpansionCache received invalid cards:", cards);
    throw new Error("initExpansionCache: cards must be a valid array");
  }
  cardCache.push(...cards);
}

export function getCardCache(): Card[] {
  return cardCache;
}
