import { useState, useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { SealedPackView } from "@/components/pack/sealed-pack-view";
import { CardRevealView } from "@/components/pack/card-reveal-view";
import { usePlayer } from "@/contexts/player-context";
import { Card } from "@/api/fetchCards";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";
import { openPack, findPack } from "@/services/pack-service";
import { StyleSheet } from "react-native";

type OpeningState =
  | { status: "sealed"; pack: BoosterPack }
  | { status: "revealing"; cards: Card[]; currentIndex: number }
  | { status: "not_found" };

function usePackOpening(packId: string | undefined) {
  const router = useRouter();
  const { player, updatePlayer } = usePlayer();

  const packData = useMemo(() => {
    if (!packId) return null;
    const pack = findPack(player.packInventory, packId);
    return pack ? { pack, cards: [...pack.cards] } : null;
  }, [packId, player.packInventory]);

  const [revealState, setRevealState] = useState<{
    isRevealing: boolean;
    cards: Card[];
    currentIndex: number;
  }>({ isRevealing: false, cards: [], currentIndex: 0 });

  const handleOpenPack = useCallback(() => {
    if (!packData) return;

    const result = openPack(player, packData.pack);
    updatePlayer(result.updates);
    setRevealState({ isRevealing: true, cards: result.cards, currentIndex: 0 });
  }, [packData, player, updatePlayer]);

  const revealNextCard = useCallback(() => {
    setRevealState((prev) => {
      if (prev.currentIndex < prev.cards.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
      router.back();
      return prev;
    });
  }, [router]);

  const state: OpeningState = useMemo(() => {
    if (revealState.isRevealing) {
      return {
        status: "revealing",
        cards: revealState.cards,
        currentIndex: revealState.currentIndex,
      };
    }
    if (packData) {
      return { status: "sealed", pack: packData.pack };
    }
    return { status: "not_found" };
  }, [revealState, packData]);

  return { state, openPack: handleOpenPack, revealNextCard };
}

function PackNotFound() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.notFoundText}>Pack not found</ThemedText>
    </ThemedView>
  );
}

export default function PackOpeningScreen() {
  const { packId } = useLocalSearchParams<{ packId: string }>();
  const { state, openPack, revealNextCard } = usePackOpening(packId);

  switch (state.status) {
    case "not_found":
      return <PackNotFound />;

    case "sealed":
      return <SealedPackView pack={state.pack} onOpen={openPack} />;

    case "revealing":
      return (
        <CardRevealView
          cards={state.cards}
          currentIndex={state.currentIndex}
          onNext={revealNextCard}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
