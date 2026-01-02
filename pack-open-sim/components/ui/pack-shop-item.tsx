import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { MoneyDisplay } from "./money-display";
import { PACK_PRICE } from "@/constants/packs";

interface PackShopItemProps {
  image: ImageSourcePropType;
  onPress: () => void;
  disabled: boolean;
}

export function PackShopItem({ image, onPress, disabled }: PackShopItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <Image source={image} style={styles.image} />
      </TouchableOpacity>
      <MoneyDisplay amount={PACK_PRICE} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  button: {
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  image: {
    width: 120,
    height: 200,
    resizeMode: "contain",
  },
});
