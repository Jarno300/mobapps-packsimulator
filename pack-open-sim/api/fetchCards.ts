import { initExpansionCache } from "@/cache/setCardCache";

export interface Card {
  id: string;
  name: string;
  localId?: string;
  types?: Array<string>;
  rarity?: string;
  image?: string;
  holo?: boolean;
}

const API_URL = "https://api.tcgdex.net/v2/en";

let isFetching = false;
let hasFetched = false;
let fetchError: Error | null = null;

export function getFetchStatus() {
  return { isFetching, hasFetched, fetchError };
}

export function resetFetchStatus() {
  hasFetched = false;
  fetchError = null;
}

async function fetchCardDetails(cardId: string): Promise<Card | null> {
  try {
    const response = await fetch(`${API_URL}/cards/${cardId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch card ${cardId}: ${response.status}`);
      return null;
    }
    const card = await response.json();
    return {
      id: card.id,
      name: card.name,
      localId: card.localId,
      rarity: card.rarity,
      types: card.types,
      image: card.image ? `${card.image}/high.webp` : undefined,
      holo: card.variants?.holo ?? false,
    };
  } catch (error) {
    console.warn(`Error fetching card ${cardId}:`, error);
    return null;
  }
}

async function fetchCardsInBatches(
  cardIds: string[],
  batchSize = 10
): Promise<Card[]> {
  const cards: Card[] = [];

  for (let i = 0; i < cardIds.length; i += batchSize) {
    const batch = cardIds.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchCardDetails));

    for (const card of batchResults) {
      if (card) {
        cards.push(card);
      }
    }

    if (i + batchSize < cardIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return cards;
}

export async function fetchBaseSetCards() {
  if (isFetching || hasFetched) {
    return;
  }

  isFetching = true;
  fetchError = null;

  try {
    const endpoint = `${API_URL}/sets/base1`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const rawCards = json.cards || [];

    if (!Array.isArray(rawCards) || rawCards.length === 0) {
      throw new Error("No cards found in API response");
    }

    console.log(
      "Found",
      rawCards.length,
      "cards in set, fetching full details..."
    );

    const cardIds = rawCards.map((card: any) => card.id);
    const cards = await fetchCardsInBatches(cardIds);

    console.log("Fetched full details for", cards.length, "cards");

    await initExpansionCache(cards);
    hasFetched = true;
  } catch (error) {
    fetchError = error as Error;
    console.error("Error in fetchBaseSetCards:", error);
    throw error;
  } finally {
    isFetching = false;
  }
}
