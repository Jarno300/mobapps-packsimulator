import { StyleSheet, View, ScrollView, Text } from "react-native";

import { MoneyDisplay } from "@/components/ui/money-display";
import { PackShopItem } from "@/components/ui/pack-shop-item";
import { PokeBorder } from "@/components/ui/poke-border";
import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";
import { buyPack, canAffordPack } from "@/services/shop-service";
import { AVAILABLE_PACKS } from "@/constants/packs";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

export default function ShopScreen() {
  const { player, updatePlayer } = usePlayer();
  const { isDark } = useTheme();

  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  const handleBuyPack = (packName: string, image: any) => {
    const result = buyPack(player, packName, image);
    if (result.success && result.updates) {
      updatePlayer(result.updates);
    }
  };

  const canBuy = canAffordPack(player.money);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.contentPadding}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Shop
            </Text>
            <MoneyDisplay amount={player.money} size="medium" />
          </View>

          <PokeBorder borderColor={colors.border}>
            <View
              style={[styles.packsContainer, { backgroundColor: colors.card }]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Booster Packs
              </Text>
              <View style={styles.packsGrid}>
                {AVAILABLE_PACKS.map((pack) => (
                  <View key={pack.id} style={styles.packItem}>
                    <PackShopItem
                      image={pack.image}
                      displayName={pack.displayName}
                      onBuy={() => handleBuyPack(pack.name, pack.image)}
                      disabled={!canBuy}
                      isDark={isDark}
                    />
                  </View>
                ))}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.pokemon,
  },
  packsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.pokemon,
    marginBottom: 12,
  },
  packsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  packItem: {
    width: "100%",
  },
});
