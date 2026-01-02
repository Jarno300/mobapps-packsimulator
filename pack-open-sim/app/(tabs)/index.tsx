import { ScrollView, StyleSheet, View, Text } from "react-native";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";
import { NameInputScreen } from "@/components/screens/name-input-screen";
import { StatCard } from "@/components/ui/stat-card";
import { RarityBadge } from "@/components/ui/rarity-badge";
import { CollectionProgress } from "@/components/ui/collection-progress";
import { RARITY_COLORS, THEME_COLORS } from "@/constants/colors";

export default function HomeScreen() {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();

  if (player.username === "DefaultPlayerName") {
    return (
      <NameInputScreen onSubmit={(name) => updatePlayer({ username: name })} />
    );
  }

  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const themeMode = isDark ? "dark" : "light";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.welcomeSection}>
            <Text
              style={[styles.welcomeLabel, { color: colors.textSecondary }]}
            >
              Welcome back,
            </Text>
            <Text style={[styles.welcomeName, { color: colors.textPrimary }]}>
              {player.username}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Money"
              value={`$${player.money.toLocaleString()}`}
              isDark={isDark}
            />
            <StatCard
              label="Packs Opened"
              value={player.openedPacks}
              isDark={isDark}
            />
          </View>

          <CollectionProgress
            collected={Object.keys(player.ownedCards).length}
            total={102}
            isDark={isDark}
          />

          <View
            style={[
              styles.raritiesSection,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
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
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
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
});
