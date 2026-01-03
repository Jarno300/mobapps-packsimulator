import { View, StyleSheet, ViewStyle } from "react-native";

interface PokeBorderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
}

export function PokeBorder({
  children,
  style,
  borderColor = "#1a1a1a",
}: PokeBorderProps) {
  return (
    <View style={[styles.outerBorder, { borderColor }, style]}>
      <View style={[styles.innerBorder, { borderColor }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBorder: {
    borderWidth: 3,
    borderRadius: 10,
    borderStyle: "solid",
  },
  innerBorder: {
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "solid",
    margin: 2,
  },
});
