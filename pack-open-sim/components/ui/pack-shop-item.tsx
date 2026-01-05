import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { PACK_PRICE } from "@/constants/packs";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface PackShopItemProps {
  image: ImageSourcePropType;
  displayName: string;
  onBuy: () => void;
  disabled: boolean;
  isDark: boolean;
}

export function PackShopItem({
  image,
  displayName,
  onBuy,
  disabled,
  isDark,
}: PackShopItemProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View style={styles.container}>
      <View style={styles.packWrapper}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={[styles.packName, { color: colors.textPrimary }]}>
        {displayName}
      </Text>
      <TouchableOpacity
        style={[
          styles.buyButton,
          { backgroundColor: disabled ? colors.textMuted : "#4CAF50" },
        ]}
        onPress={onBuy}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buyButtonText}>Buy for {PACK_PRICE}</Text>
        <Image
          source={require("@/assets/images/pokecoin.png")}
          style={styles.coinIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 12,
  },
  packWrapper: {
    marginBottom: 8,
  },
  image: {
    width: 140,
    height: 233,
    resizeMode: "contain",
  },
  packName: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
    marginBottom: 8,
    textAlign: "center",
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FONTS.pokemon,
  },
  coinIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
});
