export interface Card {
  id: string;
  name: string;
  type?: string;
  rarity?: string;
  images?: {
    small: string;
    large: string;
  };
}

const API_URL = "https://api.pokemontcg.io/v2";

export async function fetchBaseSetCards(): Promise<Card[]> {
  const response = await fetch(`${API_URL}/cards?q=set.id:base1`);
  if (!response.ok) {
    throw new Error("Failed to get API response");
  }
  const json = await response.json();
  return json.data as Card[];
}
