import { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Switch } from "react-native";
import { useTheme } from "@/contexts/theme-context";
import Achievement from "@/components/pokémon-related-components/achievement";

export default function AchievementsScreen() {
  const { isDark } = useTheme();
  const [hideClaimed, setHideClaimed] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121316" : "#F3F4F6" },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#FFFFFF" : "#1F2937" }]}
            >
              Achievements
            </Text>
          </View>

          <View
            style={[
              styles.filterCard,
              {
                backgroundColor: isDark ? "#1E2024" : "#FFFFFF",
                borderColor: isDark ? "#2A2D32" : "#E8E8E8",
              },
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                { color: isDark ? "#FFFFFF" : "#1F2937" },
              ]}
            >
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

          <Achievement
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
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
            hideClaimed={hideClaimed}
            title="Holo Rare Collector II"
            subtitle="Obtain 5 holo rare cards - 1000$"
            condition={(player) => player.obtainedRaritiesTotal.holoRare >= 5}
            onClaim={({ player, updatePlayer }) => {
              updatePlayer({
                money: player.money + 1000,
                achievements: [
                  ...player.achievements,
                  "Holo Rare Collector II",
                ],
              });
            }}
          />
          <Achievement
            hideClaimed={hideClaimed}
            title="Holo Rare Collector III"
            subtitle="Obtain 10 holo rare cards - 1500$"
            condition={(player) => player.obtainedRaritiesTotal.holoRare >= 10}
            onClaim={({ player, updatePlayer }) => {
              updatePlayer({
                money: player.money + 1500,
                achievements: [
                  ...player.achievements,
                  "Holo Rare Collector III",
                ],
              });
            }}
          />
          <Achievement
            hideClaimed={hideClaimed}
            title="Holo Rare Collector IV"
            subtitle="Obtain 20 holo rare cards - 2000$"
            condition={(player) => player.obtainedRaritiesTotal.holoRare >= 20}
            onClaim={({ player, updatePlayer }) => {
              updatePlayer({
                money: player.money + 2000,
                achievements: [
                  ...player.achievements,
                  "Holo Rare Collector IV",
                ],
              });
            }}
          />
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
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  filterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
