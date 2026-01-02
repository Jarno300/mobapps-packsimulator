import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";

function NameInputScreen({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <View style={styles.nameScreenContainer}>
      <Text style={styles.nameLabel}>Your name:</Text>
      <TextInput
        style={styles.nameInput}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="rgba(255,255,255,0.5)"
        autoFocus
      />
      <Pressable
        style={[
          styles.submitButton,
          !name.trim() && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!name.trim()}
      >
        <Text style={styles.submitButtonText}>Start</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const { player, updatePlayer } = usePlayer();

  if (player.username === "DefaultPlayerName") {
    return (
      <NameInputScreen onSubmit={(name) => updatePlayer({ username: name })} />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
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
  nameScreenContainer: {
    flex: 1,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  nameLabel: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  nameInput: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#fff",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#ff0000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
