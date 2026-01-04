import { Card } from "@/api/fetchCards";
import { usePlayer } from "@/contexts/player-context";

export function useSellCard() {
    const { player, updatePlayer } = usePlayer();

    function sellCard(card: Card) {
        const price = card.price;
        const ownedCardList = player.ownedCards;
        const AmountOfSpecificCard = ownedCardList[card.id] ?? 0;
        console.log(AmountOfSpecificCard)
        if (price !== undefined && price >= 0 && AmountOfSpecificCard > 0) {
            updatePlayer({
                money: player.money + price,
                ownedCards: { ...player.ownedCards, [card.id]: AmountOfSpecificCard - 1 }
            }
            )
        }
    }

    return { sellCard }



}