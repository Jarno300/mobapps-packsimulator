import { View, StyleSheet, Image, Pressable } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";
import { Card } from "@/api/fetchCards";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";

const PACK_IMAGES: Record<string, ReturnType<typeof require>> = {
  "Booster-Pack-Charizard": require("@/assets/images/Booster-Pack-Charizard.png"),
  "Booster-Pack-Blastoise": require("@/assets/images/Booster-Pack-Blastoise.png"),
  "Booster-Pack-Bulbasaur": require("@/assets/images/Booster-Pack-Bulbasaur.png"),
};

type OpeningState =
  | { status: "sealed"; pack: BoosterPack }
  | { status: "revealing"; cards: Card[]; currentIndex: number }
  | { status: "not_found" };

function usePackOpening(packId: string | undefined) {
  const router = useRouter();
  const { player, updatePlayer } = usePlayer();

  const packData = useMemo(() => {
    if (!packId) return null;
    const pack = player.packInventory.find(
      (p) => p.id === parseInt(packId, 10)
    );
    return pack ? { pack, cards: [...pack.cards] } : null;
  }, [packId, player.packInventory]);

  const [revealState, setRevealState] = useState<{
    isRevealing: boolean;
    cards: Card[];
    currentIndex: number;
  }>({ isRevealing: false, cards: [], currentIndex: 0 });

  const openPack = useCallback(() => {
    if (!packData) return;

    const { pack, cards } = packData;

    const updatedInventory = player.packInventory.filter(
      (p) => p.id !== pack.id
    );

    const updatedOwnedCards = { ...player.ownedCards };
    for (const card of cards) {
      updatedOwnedCards[card.id] = (updatedOwnedCards[card.id] || 0) + 1;
    }

    // Calculate rarity counts for opened cards
    const rarityCounts = {
      energy: 0,
      common: 0,
      uncommon: 0,
      rare: 0,
      holoRare: 0,
    };
    for (const card of cards) {
      const rarity = card.rarity?.toLowerCase();
      const isEnergy = card.name.toLowerCase().endsWith("energy");

      if (isEnergy) {
        rarityCounts.energy++;
      } else if (rarity === "common") {
        rarityCounts.common++;
      } else if (rarity === "uncommon") {
        rarityCounts.uncommon++;
      } else if (rarity === "rare") {
        if (card.holo) {
          rarityCounts.holoRare++;
        } else {
          rarityCounts.rare++;
        }
      }
    }

    const updatedRaritiesTotal = {
      energy: player.obtainedRaritiesTotal.energy + rarityCounts.energy,
      common: player.obtainedRaritiesTotal.common + rarityCounts.common,
      uncommon: player.obtainedRaritiesTotal.uncommon + rarityCounts.uncommon,
      rare: player.obtainedRaritiesTotal.rare + rarityCounts.rare,
      holoRare: player.obtainedRaritiesTotal.holoRare + rarityCounts.holoRare,
    };

    updatePlayer({
      packInventory: updatedInventory,
      openedPacks: player.openedPacks + 1,
      ownedCards: updatedOwnedCards,
      obtainedRaritiesTotal: updatedRaritiesTotal,
    });

    setRevealState({ isRevealing: true, cards, currentIndex: 0 });
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

  // Determine current state
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

  return { state, openPack, revealNextCard };
}

function PackNotFound() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.notFoundText}>Pack not found</ThemedText>
    </ThemedView>
  );
}

function PackImage({ packName }: { packName: string }) {
  const imageSource = PACK_IMAGES[packName];

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={styles.packImage}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={styles.packPlaceholder}>
      <ThemedText style={styles.packName}>{packName}</ThemedText>
    </View>
  );
}

function SealedPackView({
  pack,
  onOpen,
}: {
  pack: BoosterPack;
  onOpen: () => void;
}) {
  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onOpen} style={styles.pressableContainer}>
        <PackImage packName={pack.name} />
        <ThemedText style={styles.tapText}>Tap to open</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

function CardImage({ card }: { card: Card }) {
  if (card.image) {
    return (
      <Image
        source={{ uri: card.image }}
        style={styles.cardImage}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={styles.cardPlaceholder}>
      <ThemedText style={styles.cardName}>{card.name}</ThemedText>
    </View>
  );
}

function CardRevealView({
  cards,
  currentIndex,
  onNext,
}: {
  cards: Card[];
  currentIndex: number;
  onNext: () => void;
}) {
  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;
  const progressText = `Card ${currentIndex + 1} of ${cards.length}`;
  const actionText = isLastCard ? "Tap to finish" : "Tap to reveal next card";

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.cardCounter}>{progressText}</ThemedText>

      <Pressable onPress={onNext} style={styles.pressableContainer}>
        <CardImage card={currentCard} />
        <ThemedText style={styles.tapText}>{actionText}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

// =============================================================================
// Main Screen
// =============================================================================

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

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pressableContainer: {
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    opacity: 0.6,
  },

  // Pack
  packImage: {
    width: 200,
    height: 340,
  },
  packPlaceholder: {
    width: 200,
    height: 340,
    backgroundColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  packName: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },

  // Card
  cardImage: {
    width: 250,
    height: 350,
    borderRadius: 12,
  },
  cardPlaceholder: {
    width: 250,
    height: 350,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardName: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  cardCounter: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 16,
  },

  // Shared
  tapText: {
    marginTop: 24,
    fontSize: 18,
    opacity: 0.7,
    fontWeight: "600",
  },
});
