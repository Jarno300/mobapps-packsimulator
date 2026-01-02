import type { ImageSourcePropType } from "react-native";

export const PACK_IMAGES: Record<string, ReturnType<typeof require>> = {
  "Booster-Pack-Charizard": require("@/assets/images/Booster-Pack-Charizard.png"),
  "Booster-Pack-Blastoise": require("@/assets/images/Booster-Pack-Blastoise.png"),
  "Booster-Pack-Bulbasaur": require("@/assets/images/Booster-Pack-Bulbasaur.png"),
};

export const PACK_PRICE = 500;

export interface PackConfig {
  id: string;
  name: string;
  displayName: string;
  image: ImageSourcePropType;
}

export const AVAILABLE_PACKS: PackConfig[] = [
  {
    id: "charizard",
    name: "Booster-Pack-Charizard",
    displayName: "Charizard Pack",
    image: require("@/assets/images/Booster-Pack-Charizard.png"),
  },
  {
    id: "blastoise",
    name: "Booster-Pack-Blastoise",
    displayName: "Blastoise Pack",
    image: require("@/assets/images/Booster-Pack-Blastoise.png"),
  },
  {
    id: "bulbasaur",
    name: "Booster-Pack-Bulbasaur",
    displayName: "Bulbasaur Pack",
    image: require("@/assets/images/Booster-Pack-Bulbasaur.png"),
  },
];
