import { View, Text, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "@/components/ui/poke-border";

interface StatCardProps {
  label: string;
  value: string | number | ReactNode;
  isDark: boolean;
}

export function StatCard({ label, value, isDark }: StatCardProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  const isTextValue = typeof value === "string" || typeof value === "number";

  return (
    <PokeBorder style={styles.container} borderColor={colors.border}>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
        {isTextValue ? (
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {value}
          </Text>
        ) : (
          value
        )}
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
