import { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Switch } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import { usePlayer } from "@/contexts/player-context";
import Achievement from "@/components/pokémon-related-components/achievement";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { PokeBorder } from "@/components/ui/poke-border";

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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Achievements
            </Text>
          </View>

          <PokeBorder style={styles.filterWrapper} borderColor={colors.border}>
            <View style={[styles.filterCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>
                Hide claimed
              </Text>
              <Switch
                value={hideClaimed}
                onValueChange={setHideClaimed}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </PokeBorder>

          {ACHIEVEMENTS.map((achievement) => (
            <Achievement
              key={achievement.id}
              hideClaimed={hideClaimed}
              title={achievement.title}
              subtitle={achievement.subtitle}
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
});
