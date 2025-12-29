import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Achievement from "@/components/achievement";

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
