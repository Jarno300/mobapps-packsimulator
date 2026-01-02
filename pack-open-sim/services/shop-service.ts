import type { ImageSourcePropType } from "react-native";
import { Player } from "@/contexts/player-context";
import { createBoosterPack } from "@/components/pokémon-related-components/booster-pack";
import { PACK_PRICE } from "@/constants/packs";

export interface BuyPackResult {
  success: boolean;
  updates?: Partial<Player>;
}

export function canAffordPack(money: number): boolean {
  return money >= PACK_PRICE;
}

export function buyPack(
  player: Player,
  packName: string,
  image: ImageSourcePropType
): BuyPackResult {
  if (!canAffordPack(player.money)) {
    return { success: false };
  }

  const newPack = createBoosterPack(packName, image);

  return {
    success: true,
    updates: {
      money: player.money - PACK_PRICE,
      packInventory: [...player.packInventory, newPack],
    },
  };
}
