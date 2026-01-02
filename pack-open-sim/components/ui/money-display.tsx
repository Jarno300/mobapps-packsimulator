import { View, Text, Image, StyleSheet } from "react-native";

interface MoneyDisplayProps {
  amount: number;
  size?: "small" | "medium" | "large";
  textStyle?: object;
}

const SIZES = {
  small: { coin: 16, font: 14 },
  medium: { coin: 20, font: 20 },
  large: { coin: 25, font: 24 },
};

export function MoneyDisplay({
  amount,
  size = "medium",
  textStyle,
}: MoneyDisplayProps) {
  const dimensions = SIZES[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: dimensions.font }, textStyle]}>
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
    gap: 3,
  },
  text: {
    fontWeight: "600",
  },
  coin: {
    resizeMode: "contain",
  },
});
