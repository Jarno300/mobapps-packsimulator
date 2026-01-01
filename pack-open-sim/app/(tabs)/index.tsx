import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";

export default function HomeScreen() {
  const { player } = usePlayer();
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header} />
        <ThemedView style={styles.contentPadding}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">
              Welcome back, {player.username}!
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.profileSection}>
            <View style={styles.statsRow}>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Money</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {player.money.toLocaleString()}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Opened Packs</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {player.openedPacks}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Luck</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {player.luck}
                </ThemedText>
              </ThemedView>
            </View>

            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Obtained Rarities
              </ThemedText>
              <View style={styles.raritiesGrid}>
                <ThemedText>
                  Energy: {player.obtainedRaritiesTotal.energy}
                </ThemedText>
                <ThemedText>
                  Common: {player.obtainedRaritiesTotal.common}
                </ThemedText>
                <ThemedText>
                  Uncommon: {player.obtainedRaritiesTotal.uncommon}
                </ThemedText>
                <ThemedText>
                  Rare: {player.obtainedRaritiesTotal.rare}
                </ThemedText>
                <ThemedText>
                  Holo Rare: {player.obtainedRaritiesTotal.holoRare}
                </ThemedText>
              </View>
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Collected Cards
              </ThemedText>
              <ThemedText>
                {Object.keys(player.ownedCards).length} / 102 cards collected
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: "#ff0000",
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 24,
  },
  profileSection: {
    gap: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  statItem: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(10, 126, 164, 0.1)",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
  },
  section: {
    gap: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  raritiesGrid: {
    gap: 6,
  },
});
