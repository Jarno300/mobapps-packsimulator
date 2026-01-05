import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/theme-context";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface EmptyStateProps {
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  message,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const { isDark } = useTheme();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {onAction && actionLabel && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card }]}
          onPress={onAction}
        >
          <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  message: {
    fontFamily: FONTS.pokemon,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  actionLabel: {
    fontFamily: FONTS.pokemon,
    fontSize: 12,
  },
});
