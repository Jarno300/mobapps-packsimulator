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
    const rareList: Card[] = [];
    const holoList: Card[] = [];
    const uncommonList: Card[] = [];
    const commonList: Card[] = [];
    const energyList: Card[] = [];
    const cardRandomizer: Card[] = [];
    const rareHoloOdds = Math.random();

    // maakt rareList en holoList 
    cardList.forEach(card => {

        if (card.holo) {

            holoList.push(card);
        }
        if (card.rarity === "Rare" && !card.holo) {
            rareList.push(card);
        }
        if (card.name.endsWith("Energy")) {
            energyList.push(card);
        }
        if (card.rarity === "Uncommon" && !card.name.endsWith("Energy")) {
            uncommonList.push(card);
        }
        if (card.rarity === "Common" && !card.name.endsWith("Energy")) {
            commonList.push(card);
        }

    });

    console.log(rareList);
    console.log(holoList);





    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * energyList.length);
        cardRandomizer.push(energyList[randomIndex]);
    }

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * commonList.length);
        cardRandomizer.push(commonList[randomIndex]);
    }


    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * uncommonList.length);
        cardRandomizer.push(uncommonList[randomIndex]);
    }

    if (rareHoloOdds <= 0.33) {
        const randomIndex = Math.floor(Math.random() * holoList.length);
        cardRandomizer.push(holoList[randomIndex]);
    }
    else {
        const randomIndex = Math.floor(Math.random() * rareList.length);
        cardRandomizer.push(rareList[randomIndex]);
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
