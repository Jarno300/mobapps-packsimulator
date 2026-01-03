import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

interface RarityBadgeProps {
  label: string;
  count: number;
  icon: ImageSourcePropType;
  isDark: boolean;
}

export function RarityBadge({ label, count, icon, isDark }: RarityBadgeProps) {
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
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.count, { color: colors.textPrimary }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 1,
    gap: 8,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
  count: {
    fontSize: 14,
    fontFamily: FONTS.pokemon,
  },
});
