import { useRef, useEffect } from "react";
import { View, Pressable, Animated, Easing, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { CardImage } from "./card-image";
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
  const progressText = `Card ${currentIndex + 1} of ${cards.length}`;
  const actionText = isLastCard ? "Tap to finish" : "Tap to reveal next card";

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const cardType = currentCard.types?.[0] || "default";
  const typeColors = TYPE_COLORS[cardType] || TYPE_COLORS.default;

  useEffect(() => {
    fadeAnim.setValue(0);
    pulseAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

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

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [typeColors.primary, typeColors.secondary],
  });

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const glowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
            backgroundColor: typeColors.primary,
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ThemedText style={[styles.counter, styles.lightText]}>
          {progressText}
        </ThemedText>

        <Pressable onPress={onNext} style={styles.pressable}>
          <CardImage card={currentCard} size="large" />
          <ThemedText style={[styles.tapText, styles.lightText]}>
            {actionText}
          </ThemedText>
        </Pressable>

        <View style={styles.typeBadge}>
          <ThemedText style={styles.typeBadgeText}>{cardType}</ThemedText>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  content: {
    alignItems: "center",
    zIndex: 1,
  },
  counter: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 16,
  },
  pressable: {
    alignItems: "center",
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
