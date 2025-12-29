import { initExpansionCache } from "@/cache/setCardCache";

export interface Card {
  id: string;
  name: string;
  localId?: string;
  superType?: string;
  subTypes?: string;
  rarity?: string;
  image?: string;
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

export async function fetchBaseSetCards() {
  if (isFetching || hasFetched) {
    return;
  }

  isFetching = true;
  fetchError = null;

  try {
    // Use the sets endpoint which returns card data with the set
    const endpoint = `${API_URL}/sets/base1`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();

    // TCGdex set endpoint returns { cards: [...] }
    const rawCards = json.cards || [];

    if (!Array.isArray(rawCards) || rawCards.length === 0) {
      throw new Error("No cards found in API response");
    }

    // Normalize cards with full image URLs
    const cards: Card[] = rawCards.map((card: any) => ({
      id: card.id,
      name: card.name,
      localId: card.localId,
      rarity: card.rarity,
      // TCGdex now returns full image URL - just append quality suffix
      image: card.image ? `${card.image}/high.webp` : undefined,
    }));

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
