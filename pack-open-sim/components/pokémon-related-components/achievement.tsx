import { StyleSheet, Button, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Player, usePlayer } from "@/contexts/player-context";

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
  const canClaim =
    props.condition(player) && !player.achievements.includes(props.title);

  return (
    <View style={styles.shadowWrapper}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          {props.title}
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {props.subtitle}
        </ThemedText>

        <Button
          title="Claim"
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
    backgroundColor: "#1E1E24", // tweak for your theme
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
