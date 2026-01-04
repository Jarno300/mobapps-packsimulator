import { useCallback } from "react";
import { Card } from "@/api/fetchCards";
import { usePlayer } from "@/contexts/player-context";

export function useSellCard() {
    const { player, updatePlayer } = usePlayer();

    const sellCard = useCallback((card: Card) => {
        const price = card.price;
        const ownedCardList = player.ownedCards;
        const amountOfSpecificCard = ownedCardList[card.id] ?? 0;

        console.log(amountOfSpecificCard);

        if (price !== undefined && price >= 0 && amountOfSpecificCard > 0) {
            updatePlayer({
                money: player.money + price,
                ownedCards: {
                    ...ownedCardList,
                    [card.id]: amountOfSpecificCard - 1,
                },
            });
        }
    }, [player, updatePlayer]); // vaste deps

    return { sellCard };
}
