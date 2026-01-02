import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PACK_IMAGES } from "@/constants/packs";

interface PackImageProps {
  packName: string;
  size?: "small" | "medium" | "large";
}

const SIZES = {
  small: { width: 100, height: 180 },
  medium: { width: 150, height: 255 },
  large: { width: 200, height: 340 },
};

export function PackImage({ packName, size = "large" }: PackImageProps) {
  const imageSource = PACK_IMAGES[packName];
  const dimensions = SIZES[size];

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={[styles.image, dimensions]}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={[styles.placeholder, dimensions]}>
      <ThemedText style={styles.placeholderText}>{packName}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {},
  placeholder: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
});
