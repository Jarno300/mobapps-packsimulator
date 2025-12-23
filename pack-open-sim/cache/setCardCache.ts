import { Card } from "@/api/fetchCards";

const cardCache: Card[] = [];

export async function initExpansionCache(cards: Card[]): Promise<void> {
  cardCache.push(...cards);
}
