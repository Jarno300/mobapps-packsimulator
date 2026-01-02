import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Achievement from "@/components/pokémon-related-components/achievement";

export default function AchievementsScreen() {
  return (
    <ScrollView>
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
        <Achievement
          title="Pack Opener IV"
          subtitle="Open 50 packs - 5000$"
          condition={(player) => player.openedPacks >= 50}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 5000,
              achievements: [...player.achievements, "Pack Opener IV"],
            });
          }}
        />
        <Achievement
          title="Pack Opener V"
          subtitle="Open 100 packs - 10000$"
          condition={(player) => player.openedPacks >= 25}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 10000,
              achievements: [...player.achievements, "Pack Opener V"],
            });
          }}
        />
        <Achievement
          title="Holo Rare Collector I"
          subtitle="Obtain 1 holo rare card - 500$"
          condition={(player) => player.obtainedRaritiesTotal.holoRare >= 1}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 500,
              achievements: [...player.achievements, "Holo Rare Collector I"],
            });
          }}
        />
        <Achievement
          title="Holo Rare Collector II"
          subtitle="Obtain 5 holo rare cards - 1000$"
          condition={(player) => player.obtainedRaritiesTotal.holoRare >= 5}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 1000,
              achievements: [...player.achievements, "Holo Rare Collector II"],
            });
          }}
        />
        <Achievement
          title="Holo Rare Collector III"
          subtitle="Obtain 10 holo rare cards - 1500$"
          condition={(player) => player.obtainedRaritiesTotal.holoRare >= 10}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 1500,
              achievements: [...player.achievements, "Holo Rare Collector III"],
            });
          }}
        />
        <Achievement
          title="Holo Rare Collector IV"
          subtitle="Obtain 20 holo rare cards - 2000$"
          condition={(player) => player.obtainedRaritiesTotal.holoRare >= 20}
          onClaim={({ player, updatePlayer }) => {
            updatePlayer({
              money: player.money + 2000,
              achievements: [...player.achievements, "Holo Rare Collector IV"],
            });
          }}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
