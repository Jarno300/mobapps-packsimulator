import { Player } from "@/contexts/player-context";
import { Card } from "@/api/fetchCards";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";

export interface PackOpenResult {
  cards: Card[];
  updates: Partial<Player>;
}

function calculateRarityCounts(cards: Card[]) {
  const counts = {
    energy: 0,
    common: 0,
    uncommon: 0,
    rare: 0,
    holoRare: 0,
  };

  for (const card of cards) {
    const rarity = card.rarity?.toLowerCase();
    const isEnergy = card.name.toLowerCase().endsWith("energy");

    if (isEnergy) {
      counts.energy++;
    } else if (rarity === "common") {
      counts.common++;
    } else if (rarity === "uncommon") {
      counts.uncommon++;
    } else if (rarity === "rare") {
      if (card.holo) {
        counts.holoRare++;
      } else {
        counts.rare++;
      }
    }
  }

  return counts;
}

export function openPack(player: Player, pack: BoosterPack): PackOpenResult {
  const cards = [...pack.cards];

  const updatedInventory = player.packInventory.filter((p) => p.id !== pack.id);

  const updatedOwnedCards = { ...player.ownedCards };
  for (const card of cards) {
    updatedOwnedCards[card.id] = (updatedOwnedCards[card.id] || 0) + 1;
  }

  const rarityCounts = calculateRarityCounts(cards);

  const updatedRaritiesTotal = {
    energy: player.obtainedRaritiesTotal.energy + rarityCounts.energy,
    common: player.obtainedRaritiesTotal.common + rarityCounts.common,
    uncommon: player.obtainedRaritiesTotal.uncommon + rarityCounts.uncommon,
    rare: player.obtainedRaritiesTotal.rare + rarityCounts.rare,
    holoRare: player.obtainedRaritiesTotal.holoRare + rarityCounts.holoRare,
  };

  return {
    cards,
    updates: {
      packInventory: updatedInventory,
      openedPacks: player.openedPacks + 1,
      ownedCards: updatedOwnedCards,
      obtainedRaritiesTotal: updatedRaritiesTotal,
    },
  };
}

export function findPack(
  packInventory: BoosterPack[],
  packId: string
): BoosterPack | undefined {
  return packInventory.find((p) => p.id === parseInt(packId, 10));
}
