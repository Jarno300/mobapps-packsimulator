import { initExpansionCache } from "@/cache/setCardCache";

export interface Card {
  id: string;
  name: string;
  superType?: string;
  subTypes?: string;
  rarity?: string;
  images?: {
    small: string;
    large: string;
  };
}

const API_URL = "https://api.tcgdex.net/v2/en";

export async function fetchBaseSetCards() {
  const response = await fetch(`${API_URL}/cards?set=base1`);
  if (!response.ok) {
    throw new Error("Failed to get API response");
  }
  const json = await response.json();
  // Handle different possible response structures
  const cards = Array.isArray(json) ? json : (json.data || json.cards || []);
  
  if (!Array.isArray(cards)) {
    console.error("API response is not an array:", json);
    throw new Error("Invalid API response format: expected an array of cards");
  }
  
  await initExpansionCache(cards as Card[]);
}
