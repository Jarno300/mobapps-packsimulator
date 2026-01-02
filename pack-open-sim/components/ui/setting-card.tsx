import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";

interface SettingCardProps {
  title: string;
  subtitle?: string;
  isDark: boolean;
  children: React.ReactNode;
}

export function SettingCard({
  title,
  subtitle,
  isDark,
  children,
}: SettingCardProps) {
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
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
