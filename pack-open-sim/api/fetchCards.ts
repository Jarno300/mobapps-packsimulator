import { initExpansionCache } from "@/cache/setCardCache";
import type { ImageSourcePropType } from "react-native";

export interface Card {
  id: string;
  name: string;
  localId?: string;
  types?: string[];
  energyType?: string;
  rarity?: string;
  image?: string;
  holo?: boolean;
  price?: number;
  typeLogos?: ImageSourcePropType[];
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

export async function fetchCardDetails(cardId: string): Promise<Card | null> {
  try {
    const response = await fetch(`${API_URL}/cards/${cardId}`);
    if (!response.ok) {
      console.log(`Failed to fetch card ${cardId}: HTTP ${response.status}`);
      return null;
    }
    const card = await response.json();

    const types = typeAssigner(card);

    return {
      id: card.id,
      name: card.name,
      localId: card.localId,
      rarity: card.rarity,
      types: types,
      energyType: card.energyType,
      image: card.image ? `${card.image}/high.webp` : undefined,
      holo: card.variants?.holo ?? false,
      price: card.pricing?.cardmarket?.avg
        ? Number(Math.ceil(card.pricing.cardmarket.avg))
        : 1,
      typeLogos: addPokemonTypeLogos(card),
    };
  } catch (error) {
    console.log(`Error fetching card ${cardId}:`, error);
    return null;
  }
}

async function fetchCardsInBatches(
  cardIds: string[],
  batchSize = 51
): Promise<Card[]> {
  const cards: Card[] = [];
  let failedCount = 0;

  for (let i = 0; i < cardIds.length; i += batchSize) {
    const batch = cardIds.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchCardDetails));

    for (let j = 0; j < batchResults.length; j++) {
      const card = batchResults[j];
      if (card) {
        cards.push(card);
      } else {
        failedCount++;
        console.log(`Card failed to fetch (index ${i + j}): ${batch[j]}`);
      }
    }

    if (i + batchSize < cardIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log(
    `Successfully fetched ${cards.length} cards out of ${cardIds.length} (${failedCount} failed)`
  );
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

    console.log(`Fetched ${rawCards.length} cards from base set`);
    for (const card of rawCards) {
      console.log(`Card ID: ${card.id}, Name: ${card.name}`);
    }

    if (!Array.isArray(rawCards) || rawCards.length === 0) {
      throw new Error("No cards found in API response");
    }

    const cardIds = rawCards.map((card: any) => card.id);
    const cards = await fetchCardsInBatches(cardIds);

    await initExpansionCache(cards);
    hasFetched = true;
  } catch (error) {
    fetchError = error as Error;
    throw error;
  } finally {
    isFetching = false;
  }
}

function addPokemonTypeLogos(card: Card) {
  const typeLogos: ImageSourcePropType[] = [];
  if (
    card.types?.includes("Normal") ||
    card.types?.includes("Colorless") ||
    card.name.includes("Colorless Energy")
  ) {
    typeLogos.push(require("@/assets/images/normal-type.png"));
  }
  if (
    card.types?.includes("Fighting") ||
    card.name.includes("Fighting Energy")
  ) {
    typeLogos.push(require("@/assets/images/fighting-type.png"));
  }
  if (card.types?.includes("Water") || card.name.includes("Water Energy")) {
    typeLogos.push(require("@/assets/images/water-type.png"));
  }
  if (
    card.types?.includes("Electric") ||
    card.types?.includes("Lightning") ||
    card.name.includes("Lightning Energy")
  ) {
    typeLogos.push(require("@/assets/images/electric-type.png"));
  }
  if (card.types?.includes("Fire") || card.name.includes("Fire Energy")) {
    typeLogos.push(require("@/assets/images/fire-type.png"));
  }
  if (card.types?.includes("Psychic") || card.name.includes("Psychic Energy")) {
    typeLogos.push(require("@/assets/images/psychic-type.png"));
  }
  if (card.types?.includes("Grass") || card.name.includes("Grass Energy")) {
    typeLogos.push(require("@/assets/images/grass-type.png"));
  }

  return typeLogos;
}

function typeAssigner(card: Card) {
  card.types = card.types ?? [];
  if (card.energyType) {
    if (card.name.includes("Colorless Energy")) {
      card.types?.push("Colorless");
    }
    if (card.name.includes("Fighting Energy")) {
      card.types?.push("Fighting");
    }
    if (card.name.includes("Water Energy")) {
      card.types?.push("Water");
    }
    if (card.name.includes("Lightning Energy")) {
      card.types?.push("Lightning");
    }
    if (card.name.includes("Fire Energy")) {
      card.types?.push("Fire");
    }
    if (card.name.includes("Psychic Energy")) {
      card.types?.push("Psychic");
    }
  }
  return card.types;
}
