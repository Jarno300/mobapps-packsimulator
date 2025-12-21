import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";

export default function ShopScreen() {
  const { player, updatePlayer } = usePlayer();

  const buyBasePack = () => {
    if (player.money >= 500) {
      const currentBasePacks = player.packInventory["Base Pack"] || 0;
      updatePlayer({
        money: player.money - 500,
        packInventory: {
          ...player.packInventory,
          "Base Pack": currentBasePacks + 1,
        },
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Shop
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.money}>
          {player.money.toLocaleString()}
        </ThemedText>
      </View>

      <View style={styles.packContainer}>
        <TouchableOpacity
          style={styles.packButton}
          onPress={buyBasePack}
          disabled={player.money < 500}
        >
          <View style={styles.imagePlaceholder}>
            <ThemedText>Base Pack</ThemedText>
          </View>
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            500
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    marginBottom: 0,
  },
  money: {
    fontSize: 20,
  },
  packContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  packButton: {
    opacity: 1,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#999",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 24,
  },
});
