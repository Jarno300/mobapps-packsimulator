import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const TYPE_COLORS: Record<string, { primary: string; secondary: string }> = {
  Grass: { primary: "#7AC74C", secondary: "#5A9A3B" },
  Fire: { primary: "#EE8130", secondary: "#C6611A" },
  Water: { primary: "#6390F0", secondary: "#4A6FC2" },
  Lightning: { primary: "#F7D02C", secondary: "#C9A820" },
  Psychic: { primary: "#F95587", secondary: "#D13A6A" },
  Fighting: { primary: "#C22E28", secondary: "#9C2420" },
  Darkness: { primary: "#705746", secondary: "#4D3B30" },
  Colorless: { primary: "#A8A77A", secondary: "#7A7A5C" },
  default: { primary: "#68A090", secondary: "#4A7A6A" },
};

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

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get colors based on card type
  const cardType = currentCard.types?.[0] || "default";
  const typeColors = TYPE_COLORS[cardType] || TYPE_COLORS.default;

  // Reset and start animations when card changes
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    pulseAnim.setValue(0);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Continuous pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [currentIndex, fadeAnim, pulseAnim]);

  // Interpolate background color for pulsing effect
  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [typeColors.primary, typeColors.secondary],
  });

  // Interpolate opacity for radial glow effect
  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const glowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View style={[styles.revealContainer, { backgroundColor }]}>
      {/* Animated glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
            backgroundColor: typeColors.primary,
          },
        ]}
      />

      <Animated.View style={[styles.cardContent, { opacity: fadeAnim }]}>
        <ThemedText style={[styles.cardCounter, styles.lightText]}>
          {progressText}
        </ThemedText>

        <Pressable onPress={onNext} style={styles.pressableContainer}>
          <CardImage card={currentCard} />
          <ThemedText style={[styles.tapText, styles.lightText]}>
            {actionText}
          </ThemedText>
        </Pressable>

        {/* Type badge */}
        <View style={styles.typeBadge}>
          <ThemedText style={styles.typeBadgeText}>{cardType}</ThemedText>
        </View>
      </Animated.View>
    </Animated.View>
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
  pressableContainer: {
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    opacity: 0.6,
  },

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

  // Card Reveal View
  revealContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  cardContent: {
    alignItems: "center",
    zIndex: 1,
  },
  lightText: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  typeBadge: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Shared
  tapText: {
    marginTop: 24,
    fontSize: 18,
    opacity: 0.7,
    fontWeight: "600",
  },
});
