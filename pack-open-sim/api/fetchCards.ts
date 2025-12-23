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

export async function fetchCardsBySetId(setId: string): Promise<Card[]> {
  const response = await fetch(`${API_URL}/cards?set=${setId}`);
  if (!response.ok) {
    throw new Error("Failed to get API response");
  }
  const json = await response.json();
  return json.data as Card[];
}
