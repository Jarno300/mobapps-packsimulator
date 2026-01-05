import { ScrollView, StyleSheet, View, Text } from "react-native";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";
import { NameInputScreen } from "@/components/screens/name-input-screen";
import { StatCard } from "@/components/ui/stat-card";
import { RarityBadge } from "@/components/ui/rarity-badge";
import { CollectionProgress } from "@/components/ui/collection-progress";
import { MoneyDisplay } from "@/components/ui/money-display";
import { PokeBorder } from "@/components/ui/poke-border";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

const RARITY_ICONS = {
  common: require("@/assets/rarity-icons/501px-Rarity_Common.png"),
  uncommon: require("@/assets/rarity-icons/501px-Rarity_Uncommon.png"),
  rare: require("@/assets/rarity-icons/501px-Rarity_Rare.png"),
};

export default function HomeScreen() {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();

  if (player.username === "DefaultPlayerName") {
    return (
      <NameInputScreen onSubmit={(name) => updatePlayer({ username: name })} />
    );
  }

  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.welcomeSection}>
            <Text
              style={[styles.welcomeLabel, { color: colors.textSecondary }]}
            >
              Welcome back, {player.username}!
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Wallet"
              value={
                <MoneyDisplay
                  amount={player.money}
                  size="large"
                  showBackground={false}
                />
              }
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

          <PokeBorder borderColor={colors.border}>
            <View
              style={[styles.raritiesContent, { backgroundColor: colors.card }]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Obtained Rarities
              </Text>
              <View style={styles.raritiesGrid}>
                <RarityBadge
                  label="Energy"
                  count={player.obtainedRaritiesTotal.energy}
                  icon={RARITY_ICONS.common}
                  isDark={isDark}
                />
                <RarityBadge
                  label="Common"
                  count={player.obtainedRaritiesTotal.common}
                  icon={RARITY_ICONS.common}
                  isDark={isDark}
                />
                <RarityBadge
                  label="Uncommon"
                  count={player.obtainedRaritiesTotal.uncommon}
                  icon={RARITY_ICONS.uncommon}
                  isDark={isDark}
                />
                <RarityBadge
                  label="Rare"
                  count={player.obtainedRaritiesTotal.rare}
                  icon={RARITY_ICONS.rare}
                  isDark={isDark}
                />
                <RarityBadge
                  label="Holo Rare"
                  count={player.obtainedRaritiesTotal.holoRare}
                  icon={RARITY_ICONS.rare}
                  isDark={isDark}
                />
              </View>
            </View>
          </PokeBorder>
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
    fontSize: 14,
    fontFamily: FONTS.pokemon,
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 28,
    fontFamily: FONTS.pokemon,
  },
  statsGrid: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 16,
  },
  raritiesContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.pokemon,
    marginBottom: 16,
  },
  raritiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
