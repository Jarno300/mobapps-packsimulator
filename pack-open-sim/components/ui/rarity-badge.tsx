import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";

interface RarityBadgeProps {
  label: string;
  count: number;
  color: string;
  isDark: boolean;
}

export function RarityBadge({ label, count, color, isDark }: RarityBadgeProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color + "15",
          borderColor: color + "40",
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.count, { color }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  count: {
    fontSize: 16,
    fontWeight: "700",
  },
});
