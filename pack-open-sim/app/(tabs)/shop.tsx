import { StyleSheet, View, ScrollView } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MoneyDisplay } from "@/components/ui/money-display";
import { PackShopItem } from "@/components/ui/pack-shop-item";
import { usePlayer } from "@/contexts/player-context";
import { buyPack, canAffordPack } from "@/services/shop-service";
import { AVAILABLE_PACKS } from "@/constants/packs";

export default function ShopScreen() {
  const { player, updatePlayer } = usePlayer();

  const handleBuyPack = (packName: string, image: any) => {
    const result = buyPack(player, packName, image);
    if (result.success && result.updates) {
      updatePlayer(result.updates);
    }
  };

  const canBuy = canAffordPack(player.money);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Shop
        </ThemedText>
        <MoneyDisplay amount={player.money} size="medium" />
      </View>
      <ScrollView>
        {AVAILABLE_PACKS.map((pack) => (
          <PackShopItem
            key={pack.id}
            image={pack.image}
            onPress={() => handleBuyPack(pack.name, pack.image)}
            disabled={!canBuy}
          />
        ))}
      </ScrollView>
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
});
