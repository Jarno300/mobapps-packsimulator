import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/theme-context";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface MoneyDisplayProps {
  amount: number;
  size?: "small" | "medium" | "large";
  textStyle?: object;
  showBackground?: boolean;
}

const SIZES = {
  small: { coin: 14, font: 12, padding: 6, paddingHorizontal: 10 },
  medium: { coin: 18, font: 16, padding: 8, paddingHorizontal: 14 },
  large: { coin: 22, font: 20, padding: 10, paddingHorizontal: 18 },
};

export function MoneyDisplay({
  amount,
  size = "medium",
  textStyle,
  showBackground = true,
}: MoneyDisplayProps) {
  const { isDark } = useTheme();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const dimensions = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        showBackground && {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 2,
          paddingVertical: dimensions.padding,
          paddingHorizontal: dimensions.paddingHorizontal,
          borderRadius: 8,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: dimensions.font, color: colors.textPrimary },
          textStyle,
        ]}
      >
        {amount.toLocaleString()}
      </Text>
      <Image
        source={require("@/assets/images/pokecoin.png")}
        style={[
          styles.coin,
          { width: dimensions.coin, height: dimensions.coin },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontFamily: FONTS.pokemon,
  },
  coin: {
    resizeMode: "contain",
  },
});
