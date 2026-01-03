import { View, Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "./poke-border";

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
    <PokeBorder style={styles.wrapper} borderColor={colors.border}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
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
    </PokeBorder>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  container: {},
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
    fontSize: 14,
    fontFamily: FONTS.pokemon,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
    marginTop: 4,
  },
});
