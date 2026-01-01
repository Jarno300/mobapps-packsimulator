import { StyleSheet, TouchableOpacity, View, Image, ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";
import { createBoosterPack } from "@/components/pokémon-related-components/booster-pack";

export default function ShopScreen() {
  const { player, updatePlayer } = usePlayer();

  const buyBasePack = (name: string, imageSource: ImageSourcePropType) => {
    if (player.money >= 500) {
      const newPack = createBoosterPack(name, imageSource);
      updatePlayer({
        money: player.money - 500,
        packInventory: [...player.packInventory, newPack],
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
          onPress={() =>
            buyBasePack(
              "Booster-Pack-Charizard",
              require("@/assets/images/Booster-Pack-Charizard.png")
            )
          }
          disabled={player.money < 500}
        >
          <Image
            source={require("@/assets/images/Booster-Pack-Charizard.png")}
            style={styles.imagePlaceholder}
          />
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            500
          </ThemedText>
        </View>
      </View>

      <View style={styles.packContainer}>
        <TouchableOpacity
          style={styles.packButton}
          onPress={() =>
            buyBasePack(
              "Booster-Pack-Blastoise",
              require("@/assets/images/Booster-Pack-Blastoise.png")
            )
          }
          disabled={player.money < 500}
        >
          <Image
            source={require("@/assets/images/Booster-Pack-Blastoise.png")}
            style={styles.imagePlaceholder}
          />
        </TouchableOpacity>
        <View style={styles.priceContainer}>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            500
          </ThemedText>
        </View>
      </View>

      <View style={styles.packContainer}>
        <TouchableOpacity
          style={styles.packButton}
          onPress={() =>
            buyBasePack(
              "Booster-Pack-Bulbasaur",
              require("@/assets/images/Booster-Pack-Bulbasaur.png")
            )
          }
          disabled={player.money < 500}
        >
          <Image
            source={require("@/assets/images/Booster-Pack-Bulbasaur.png")}
            style={styles.imagePlaceholder}
          />
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
    height: 200,
    resizeMode: "contain",

    justifyContent: "center",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 24,
  },
});
