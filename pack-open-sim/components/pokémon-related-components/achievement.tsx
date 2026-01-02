import { StyleSheet, Button, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
};

export default function Achievement(props: AchievementProps) {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();
  const isClaimed = player.achievements.includes(props.title);
  const canClaim = props.condition(player) && !isClaimed;

  const cardBackgroundColor = isDark ? "#1E1E24" : "#F5F5F5";

  return (
    <View style={styles.shadowWrapper}>
      <ThemedView
        style={[styles.card, { backgroundColor: cardBackgroundColor }]}
      >
        <ThemedText type="title" style={styles.title}>
          {props.title}
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {props.subtitle}
        </ThemedText>

        <Button
          title={isClaimed ? "Claimed" : "Claim"}
          onPress={() => props.onClaim({ player, updatePlayer })}
          disabled={!canClaim}
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
