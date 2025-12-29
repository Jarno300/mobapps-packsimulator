import { Card } from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";

export interface BoosterPack {
    id: number;
    name: string;
    image?: string;
    cards: Card[];
    isOpened: boolean;

}

export const createBoosterPack = (id: number, name: string, image: string): BoosterPack => {
    const cardList = getCardCache();
    const cardRandomizer: Card[] = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * cardList.length);
        cardRandomizer.push(cardList[randomIndex]);
    }
    const newPack: BoosterPack = {
        id,
        name,
        image,
        cards: cardRandomizer,
        isOpened: false
    };

    return newPack;



}
