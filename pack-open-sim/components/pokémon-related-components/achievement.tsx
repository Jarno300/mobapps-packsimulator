import { StyleSheet, View, Text, Pressable } from "react-native";
import { Player, usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "@/components/ui/poke-border";

type AchievementProps = {
  title: string;
  subtitle: string;
  condition: (player: Player) => boolean;
  onClaim: () => void;
  hideClaimed?: boolean;
};

export default function Achievement({
  title,
  subtitle,
  condition,
  onClaim,
  hideClaimed,
}: AchievementProps) {
  const { player } = usePlayer();
  const { isDark } = useTheme();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  const isClaimed = player.achievements.includes(title);
  const canClaim = condition(player) && !isClaimed;

  if (hideClaimed && isClaimed) {
    return null;
  }

  const getStatusColor = () => {
    if (isClaimed) return "#10B981";
    if (canClaim) return "#F59E0B";
    return colors.textMuted;
  };

  const getButtonStyle = () => {
    if (isClaimed) {
      return {
        backgroundColor: "#10B98120",
        borderColor: "#10B98140",
      };
    }
    if (canClaim) {
      return {
        backgroundColor: "#F59E0B",
        borderColor: "#F59E0B",
      };
    }
    return {
      backgroundColor: isDark ? "#2A2D32" : "#E5E7EB",
      borderColor: isDark ? "#3A3D42" : "#D1D5DB",
    };
  };

  const getButtonTextColor = () => {
    if (isClaimed) return "#10B981";
    if (canClaim) return "#FFFFFF";
    return colors.textMuted;
  };

  const buttonStyle = getButtonStyle();

  return (
    <PokeBorder style={styles.cardWrapper} borderColor={colors.border}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          </View>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
        </View>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: buttonStyle.backgroundColor,
              borderColor: buttonStyle.borderColor,
            },
            !canClaim && !isClaimed && styles.buttonDisabled,
          ]}
          onPress={onClaim}
          disabled={!canClaim}
        >
          <Text style={[styles.buttonText, { color: getButtonTextColor() }]}>
            {isClaimed ? "Claimed" : canClaim ? "Claim Reward" : "Locked"}
          </Text>
        </Pressable>
      </View>
    </PokeBorder>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.pokemon,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
    lineHeight: 18,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
});
