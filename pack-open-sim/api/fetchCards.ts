import { initExpansionCache } from "@/cache/setCardCache";

export interface Card {
  id: string;
  name: string;
  superType?: string;
  subTypes?: string;
  rarity?: string;
  image?: string;
}

const API_URL = "https://api.tcgdex.net/v2/en";

let isFetching = false;
let hasFetched = false;

export async function fetchBaseSetCards() {
  // Prevent multiple simultaneous fetches
  if (isFetching || hasFetched) {
    return;
  }

  isFetching = true;

  try {
    const endpoint = `${API_URL}/cards?set=base1`;

    let cards: any[] = [];

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        return;
      }

      const json = await response.json();

      // Handle different possible response structures
      const extractedCards = Array.isArray(json)
        ? json
        : json.data || json.cards || [];

      if (Array.isArray(extractedCards) && extractedCards.length > 0) {
        cards = extractedCards;
        return;
      }
    } catch (error) {
      return;
    }

    if (cards.length === 0) {
      throw new Error("Failed to fetch cards from all endpoints.");
    }

    await initExpansionCache(cards as Card[]);
    hasFetched = true;
  } catch (error) {
    console.error("Error in fetchBaseSetCards:", error);
    throw error;
  } finally {
    isFetching = false;
  }
}
