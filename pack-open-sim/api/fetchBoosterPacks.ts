import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BoosterPack,
  createBoosterPack,
} from "@/components/pokémon-related-components/booster-pack";
import { ImageSourcePropType } from "react-native";

const STORAGE_KEY = "@booster_packs";

export const savePacks = async (allPacks: BoosterPack[]) => {
  try {
    const jsonValue = JSON.stringify(allPacks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {}
};

export const getPacksFromStorage = async (): Promise<BoosterPack[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const addAndSaveNewPack = async (
  name: string,
  image: ImageSourcePropType
) => {
  const newPack = createBoosterPack(name, image);

  const currentPacks = await getPacksFromStorage();

  const updatedPacks = [...currentPacks, newPack];

  await savePacks(updatedPacks);
};
