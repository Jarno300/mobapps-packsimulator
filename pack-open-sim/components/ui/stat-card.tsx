import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";

interface StatCardProps {
  label: string;
  value: string | number;
  isDark: boolean;
}

export function StatCard({ label, value, isDark }: StatCardProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
});
