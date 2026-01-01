import { Card } from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";
import type { ImageSourcePropType } from "react-native";

export interface BoosterPack {
    id: number;
    name: string;
    image?: ImageSourcePropType;
    cards: Card[];
    isOpened: boolean;

}

export const createBoosterPack = (name: string, image: ImageSourcePropType): BoosterPack => {
    const cardList = getCardCache();
    const cardRandomizer: Card[] = [];
    for (let i = 0; i < 11; i++) {
        const randomIndex = Math.floor(Math.random() * cardList.length);
        cardRandomizer.push(cardList[randomIndex]);
    }
    const newPack: BoosterPack = {
        id: Date.now(),
        name,
        image,
        cards: cardRandomizer,
        isOpened: false
    };

    return newPack;



}
