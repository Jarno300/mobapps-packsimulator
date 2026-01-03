import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "./poke-border";

interface StatCardProps {
  label: string;
  value: string | number;
  isDark: boolean;
}

export function StatCard({ label, value, isDark }: StatCardProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <PokeBorder style={styles.container} borderColor={colors.border}>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {value}
        </Text>
      </View>
    </PokeBorder>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontFamily: FONTS.pokemon,
  },
});
