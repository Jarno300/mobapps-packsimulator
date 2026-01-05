import { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import { usePlayer } from "@/contexts/player-context";
import Achievement from "@/components/pokémon-related-components/achievement";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "@/components/ui/poke-border";
import { MoneyDisplay } from "@/components/ui/money-display";
import { AppHeader } from "@/components/ui/app-header";

export default function AchievementsScreen() {
  const { isDark } = useTheme();
  const { player, updatePlayer } = usePlayer();
  const [hideClaimed, setHideClaimed] = useState(false);

  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  const handleClaim = (title: string, reward: number) => {
    updatePlayer({
      money: player.money + reward,
      achievements: [...player.achievements, title],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Achievements
            </Text>
            <MoneyDisplay amount={player.money} size="small" />
          </View>

          <Pressable onPress={() => setHideClaimed(!hideClaimed)}>
            <PokeBorder
              style={styles.filterWrapper}
              borderColor={colors.border}
            >
              <View
                style={[styles.filterCard, { backgroundColor: colors.card }]}
              >
                <Text
                  style={[styles.filterLabel, { color: colors.textPrimary }]}
                >
                  Hide claimed
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: colors.textSecondary },
                    hideClaimed && styles.checkboxChecked,
                  ]}
                >
                  {hideClaimed && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            </PokeBorder>
          </Pressable>

          {ACHIEVEMENTS.map((achievement) => (
            <Achievement
              key={achievement.id}
              hideClaimed={hideClaimed}
              title={achievement.title}
              subtitle={achievement.subtitle}
              reward={achievement.reward}
              condition={achievement.condition}
              onClaim={() => handleClaim(achievement.title, achievement.reward)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.pokemon,
  },
  filterWrapper: {
    marginBottom: 16,
  },
  filterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: FONTS.pokemon,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
