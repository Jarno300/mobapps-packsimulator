import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "./poke-border";

interface CollectionProgressProps {
  collected: number;
  total: number;
  isDark: boolean;
}

export function CollectionProgress({
  collected,
  total,
  isDark,
}: CollectionProgressProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const progress = (collected / total) * 100;

  return (
    <PokeBorder style={styles.borderContainer} borderColor={colors.border}>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Collection Progress
          </Text>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {collected} / {total}
          </Text>
        </View>
        <View
          style={[
            styles.track,
            { backgroundColor: isDark ? "#1E2024" : "#9CA3AF" },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${progress}%`,
                backgroundColor: progress === 100 ? "#10B981" : "#EF4444",
              },
            ]}
          />
        </View>
        <Text style={[styles.percent, { color: colors.textSecondary }]}>
          {progress.toFixed(1)}% complete
        </Text>
      </View>
    </PokeBorder>
  );
}

const styles = StyleSheet.create({
  borderContainer: {
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.pokemon,
  },
  count: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  fill: {
    height: "100%",
    borderRadius: 5,
  },
  percent: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
  },
});
