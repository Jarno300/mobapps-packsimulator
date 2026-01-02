import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Achievement from "@/components/pokémon-related-components/achievement";

export default function AchievementsScreen() {
  return (
    <ThemedView style={styles.container}>
      <Achievement
        title="Pack Opener I"
        subtitle="Open 5 packs - 500$"
        condition={(player) => player.openedPacks >= 5}
        onClaim={({ player, updatePlayer }) => {
          updatePlayer({
            money: player.money + 500,
            achievements: [...player.achievements, "Pack Opener I"],
          });
        }}
      />
      <Achievement
        title="Pack Opener II"
        subtitle="Open 10 packs - 1000$"
        condition={(player) => player.openedPacks >= 10}
        onClaim={({ player, updatePlayer }) => {
          updatePlayer({
            money: player.money + 1000,
            achievements: [...player.achievements, "Pack Opener II"],
          });
        }}
      />
      <Achievement
        title="Pack Opener III"
        subtitle="Open 25 packs - 2500$"
        condition={(player) => player.openedPacks >= 25}
        onClaim={({ player, updatePlayer }) => {
          updatePlayer({
            money: player.money + 2500,
            achievements: [...player.achievements, "Pack Opener III"],
          });
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
