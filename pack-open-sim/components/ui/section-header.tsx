import { Text, StyleSheet } from "react-native";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface SectionHeaderProps {
  title: string;
  isDark: boolean;
}

export function SectionHeader({ title, isDark }: SectionHeaderProps) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <Text style={[styles.header, { color: colors.textSecondary }]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
  },
});
