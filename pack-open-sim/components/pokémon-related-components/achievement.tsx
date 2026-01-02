import { StyleSheet, View, Text, Pressable } from "react-native";
import { Player, usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";

type AchievementProps = {
  title: string;
  subtitle: string;
  condition: (player: Player) => boolean;
  onClaim: (args: {
    player: Player;
    updatePlayer: (updates: Partial<Player>) => void;
  }) => void;
  hideClaimed?: boolean;
};

export default function Achievement(props: AchievementProps) {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();
  const isClaimed = player.achievements.includes(props.title);
  const canClaim = props.condition(player) && !isClaimed;

  if (props.hideClaimed && isClaimed) {
    return null;
  }

  const getStatusColor = () => {
    if (isClaimed) return "#10B981";
    if (canClaim) return "#F59E0B";
    return isDark ? "#4B5563" : "#9CA3AF";
  };

  const getButtonStyle = () => {
    if (isClaimed) {
      return {
        backgroundColor: "#10B981" + "20",
        borderColor: "#10B981" + "40",
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

  const buttonStyle = getButtonStyle();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
          borderColor: isDark ? "#2A2D32" : "#E8E8E8",
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1F2937" }]}
          >
            {props.title}
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#8B8F96" : "#6B7280" }]}
          >
            {props.subtitle}
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
        onPress={() => props.onClaim({ player, updatePlayer })}
        disabled={!canClaim}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: isClaimed
                ? "#10B981"
                : canClaim
                ? "#FFFFFF"
                : isDark
                ? "#6B7280"
                : "#9CA3AF",
            },
          ]}
        >
          {isClaimed ? "Claimed" : canClaim ? "Claim Reward" : "Locked"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
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
    fontSize: 15,
    fontWeight: "600",
  },
});
