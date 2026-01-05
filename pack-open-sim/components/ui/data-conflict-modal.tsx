import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { usePlayer, Player } from "@/contexts/player-context";
import { FONTS } from "@/constants/fonts";
import { THEME_COLORS } from "@/constants/colors";
import { useTheme } from "@/contexts/theme-context";

function PlayerSummary({ player, label }: { player: Player; label: string }) {
  const { isDark } = useTheme();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
        Name: {player.username}
      </Text>
      <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
        Money: {player.money}
      </Text>
      <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
        Packs Opened: {player.openedPacks}
      </Text>
      <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
        Cards: {Object.keys(player.ownedCards).length}
      </Text>
      <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
        Inventory: {player.packInventory.length} packs
      </Text>
    </View>
  );
}

export function DataConflictModal() {
  const { dataConflict, resolveConflict } = usePlayer();
  const { isDark } = useTheme();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  if (!dataConflict) return null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Data Found
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You have progress saved both locally and in the cloud. Which would
            you like to keep?
          </Text>

          <View style={styles.summaries}>
            <PlayerSummary
              player={dataConflict.localPlayer}
              label="Local (This Device)"
            />
            <PlayerSummary
              player={dataConflict.cloudPlayer}
              label="Cloud (Google)"
            />
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.localButton]}
              onPress={() => resolveConflict("local")}
            >
              <Text style={styles.buttonText}>Keep Local</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.cloudButton]}
              onPress={() => resolveConflict("cloud")}
            >
              <Text style={styles.buttonText}>Keep Cloud</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.pokemon,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: FONTS.pokemon,
    textAlign: "center",
    marginBottom: 20,
  },
  summaries: {
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    padding: 12,
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: FONTS.pokemon,
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 10,
    fontFamily: FONTS.pokemon,
    marginBottom: 4,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: FONTS.pokemon,
  },
  localButton: {
    backgroundColor: "#6B7280",
  },
  cloudButton: {
    backgroundColor: "#4285F4",
  },
});
