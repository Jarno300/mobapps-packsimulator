import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoosterPack, createBoosterPack } from '@/components/pokémon-related-components/booster-pack';

const STORAGE_KEY = "@booster_packs";


export const savePacks = async (allPacks: BoosterPack[]) => {
    try {
        const jsonValue = JSON.stringify(allPacks);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error("Fout bij opslaan Boosterpacks", e);
    }
};


export const getPacksFromStorage = async (): Promise<BoosterPack[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};


export const addAndSaveNewPack = async (name: string, image: string) => {
    const newPack = createBoosterPack(name, image);

    const currentPacks = await getPacksFromStorage();

    const updatedPacks = [...currentPacks, newPack];


    await savePacks(updatedPacks);

};