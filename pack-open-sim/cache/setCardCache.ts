import { Card } from "@/api/fetchCards";

const cardCache: Card[] = [];

export async function initExpansionCache(cards: Card[]): Promise<void> {
  if (!cards || !Array.isArray(cards)) {
    throw new Error("initExpansionCache: cards must be a valid array");
  }
  cardCache.length = 0;
  cardCache.push(...cards);
}

export function getCardCache(): Card[] {
  return cardCache;
}

export function clearCardCache(): void {
  cardCache.length = 0;
}
