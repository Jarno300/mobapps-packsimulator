import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoosterPack } from '@/components/pokémon-related-components/booster-pack';

const STORAGE_KEY = "@my_app_booster_packs";

// 1. Sla packs op (bijv. na het kopen/krijgen)
export const savePacks = async (allPacks: BoosterPack[]) => {
    try {
        const jsonValue = JSON.stringify(allPacks);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error("Fout bij opslaan op Android", e);
    }
};

// 2. Haal het aantal packs op bij opstarten
export const getPacksFromStorage = async (): Promise<BoosterPack[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};