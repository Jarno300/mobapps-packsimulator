import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/api/fetchCards";

interface CardImageProps {
  card: Card;
  size?: "small" | "medium" | "large";
}

const SIZES = {
  small: { width: 100, height: 140 },
  medium: { width: 180, height: 252 },
  large: { width: 250, height: 350 },
};

export function CardImage({ card, size = "large" }: CardImageProps) {
  const dimensions = SIZES[size];

  if (card.image) {
    return (
      <Image
        source={{ uri: card.image }}
        style={[styles.image, dimensions]}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={[styles.placeholder, dimensions]}>
      <ThemedText style={styles.placeholderText}>{card.name}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
  placeholder: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
