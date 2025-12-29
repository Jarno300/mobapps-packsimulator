import { Card } from "@/api/fetchCards";

export interface BoosterPack {
    id: string;
    name: string;
    image?: string;
    cards: Card[];
    isOpened: boolean;

}
