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
import { useTheme } from "@/contexts/theme-context";

const RARITY_COLORS = {
  energy: { light: "#FFD700", dark: "#FFC107" },
  common: { light: "#78909C", dark: "#90A4AE" },
  uncommon: { light: "#4CAF50", dark: "#66BB6A" },
  rare: { light: "#2196F3", dark: "#42A5F5" },
  holoRare: { light: "#9C27B0", dark: "#BA68C8" },
};

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

function StatCard({
  label,
  value,
  icon,
  accentColor,
  isDark,
}: {
  label: string;
  value: string | number;
  icon: string;
  accentColor: string;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
          borderColor: isDark ? "#2A2D32" : "#E8E8E8",
        },
      ]}
    >
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: accentColor + "20" },
        ]}
      >
        <Text style={[styles.statIcon, { color: accentColor }]}>{icon}</Text>
      </View>
      <Text
        style={[styles.statLabel, { color: isDark ? "#8B8F96" : "#6B7280" }]}
      >
        {label}
      </Text>
      <Text
        style={[styles.statValue, { color: isDark ? "#FFFFFF" : "#1F2937" }]}
      >
        {value}
      </Text>
    </View>
  );
}

function RarityBadge({
  label,
  count,
  color,
  isDark,
}: {
  label: string;
  count: number;
  color: string;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        styles.rarityBadge,
        {
          backgroundColor: color + "15",
          borderColor: color + "40",
        },
      ]}
    >
      <View style={[styles.rarityDot, { backgroundColor: color }]} />
      <Text
        style={[styles.rarityLabel, { color: isDark ? "#C9CDD4" : "#4B5563" }]}
      >
        {label}
      </Text>
      <Text style={[styles.rarityCount, { color }]}>{count}</Text>
    </View>
  );
}

function CollectionProgress({
  collected,
  total,
  isDark,
}: {
  collected: number;
  total: number;
  isDark: boolean;
}) {
  const progress = (collected / total) * 100;

  return (
    <View
      style={[
        styles.collectionCard,
        {
          backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
          borderColor: isDark ? "#2A2D32" : "#E8E8E8",
        },
      ]}
    >
      <View style={styles.collectionHeader}>
        <Text
          style={[
            styles.collectionTitle,
            { color: isDark ? "#FFFFFF" : "#1F2937" },
          ]}
        >
          Collection Progress
        </Text>
        <Text
          style={[
            styles.collectionCount,
            { color: isDark ? "#8B8F96" : "#6B7280" },
          ]}
        >
          {collected} / {total}
        </Text>
      </View>
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? "#2A2D32" : "#E5E7EB" },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: progress === 100 ? "#10B981" : "#EF4444",
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.progressPercent,
          { color: isDark ? "#8B8F96" : "#6B7280" },
        ]}
      >
        {progress.toFixed(1)}% complete
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();

  if (player.username === "DefaultPlayerName") {
    return (
      <NameInputScreen onSubmit={(name) => updatePlayer({ username: name })} />
    );
  }

  const themeMode = isDark ? "dark" : "light";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121316" : "#F3F4F6" },
      ]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Welcome Header */}
          <View style={styles.welcomeSection}>
            <Text
              style={[
                styles.welcomeLabel,
                { color: isDark ? "#8B8F96" : "#6B7280" },
              ]}
            >
              Welcome back,
            </Text>
            <Text
              style={[
                styles.welcomeName,
                { color: isDark ? "#FFFFFF" : "#1F2937" },
              ]}
            >
              {player.username}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              label="Money"
              value={`$${player.money.toLocaleString()}`}
              icon="💰"
              accentColor="#10B981"
              isDark={isDark}
            />
            <StatCard
              label="Packs Opened"
              value={player.openedPacks}
              icon="📦"
              accentColor="#F59E0B"
              isDark={isDark}
            />
          </View>

          {/* Collection Progress */}
          <CollectionProgress
            collected={Object.keys(player.ownedCards).length}
            total={102}
            isDark={isDark}
          />

          {/* Rarities Section */}
          <View
            style={[
              styles.raritiesSection,
              {
                backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
                borderColor: isDark ? "#2A2D32" : "#E8E8E8",
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#FFFFFF" : "#1F2937" },
              ]}
            >
              Obtained Rarities
            </Text>
            <View style={styles.raritiesGrid}>
              <RarityBadge
                label="Energy"
                count={player.obtainedRaritiesTotal.energy}
                color={RARITY_COLORS.energy[themeMode]}
                isDark={isDark}
              />
              <RarityBadge
                label="Common"
                count={player.obtainedRaritiesTotal.common}
                color={RARITY_COLORS.common[themeMode]}
                isDark={isDark}
              />
              <RarityBadge
                label="Uncommon"
                count={player.obtainedRaritiesTotal.uncommon}
                color={RARITY_COLORS.uncommon[themeMode]}
                isDark={isDark}
              />
              <RarityBadge
                label="Rare"
                count={player.obtainedRaritiesTotal.rare}
                color={RARITY_COLORS.rare[themeMode]}
                isDark={isDark}
              />
              <RarityBadge
                label="Holo Rare"
                count={player.obtainedRaritiesTotal.holoRare}
                color={RARITY_COLORS.holoRare[themeMode]}
                isDark={isDark}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },

  // Collection Progress
  collectionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  collectionCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Rarities Section
  raritiesSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  raritiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  rarityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  rarityCount: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Name Input Screen
  nameScreenContainer: {
    flex: 1,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  nameLabel: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  nameInput: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    color: "#fff",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  submitButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "700",
  },
});
