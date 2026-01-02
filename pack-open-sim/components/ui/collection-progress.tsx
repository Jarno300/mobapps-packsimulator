import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
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
          { backgroundColor: isDark ? "#2A2D32" : "#E5E7EB" },
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
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
    fontSize: 13,
    fontWeight: "500",
  },
});
