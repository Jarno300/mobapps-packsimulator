import { useRef, useEffect, useState } from "react";
import { View, Pressable, Animated, Easing, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { CardInfo } from "@/app/(tabs)/inventory/card-info";
import { PulseGradientBackground } from "@/components/animations/pulse-gradient-background";
import { Fireworks } from "@/components/animations/fireworks";
import { Card } from "@/api/fetchCards";
import { TYPE_COLORS } from "@/constants/colors";

interface CardRevealViewProps {
  cards: Card[];
  currentIndex: number;
  onNext: () => void;
}

export function CardRevealView({
  cards,
  currentIndex,
  onNext,
}: CardRevealViewProps) {
  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;
  const isHoloCard = currentCard.holo === true;
  const progressText = `Card ${currentIndex + 1} of ${cards.length}`;
  const actionText = isLastCard ? "Tap to finish" : "Tap to reveal next card";

  const [fireworksActive, setFireworksActive] = useState(false);

  const cardType = currentCard.types?.[0] || "default";
  const typeColors = TYPE_COLORS[cardType] || TYPE_COLORS.default;

  useEffect(() => {
    if (isHoloCard) {
      setFireworksActive(true);
    }
  }, [isHoloCard]);

  return (
    <View style={styles.container}>
      <PulseGradientBackground
        primaryColor={typeColors.primary}
        secondaryColor={typeColors.secondary}
        currentIndex={currentIndex}
      />

      <Fireworks isActive={fireworksActive} intensity="high" />

      <View style={styles.inner}>
        {" "}
        {/* vaste 80% breedte */}
        <Animated.View style={styles.content}>
          <ThemedText style={[styles.counter, styles.lightText]}>
            {progressText}
          </ThemedText>

          <Pressable onPress={onNext} style={styles.pressable}>
            <CardInfo card={currentCard} showSellButton={false} />
            <ThemedText style={[styles.tapText, styles.lightText]}>
              {actionText}
            </ThemedText>
          </Pressable>

          <View style={styles.typeBadge}>
            <ThemedText style={styles.typeBadgeText}>{cardType}</ThemedText>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
  },
  inner: {
    width: "80%",
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
    zIndex: 10,
    width: "100%",
  },
  pressable: {
    alignItems: "center",
    width: "100%",
  },
  counter: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 16,
  },
  lightText: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tapText: {
    marginTop: 24,
    fontSize: 18,
    opacity: 0.7,
    fontWeight: "600",
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
});
