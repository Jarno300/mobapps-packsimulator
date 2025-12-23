import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlayer } from "@/contexts/player-context";
import { getCachedCardsByExpansionId } from "@/cache/setCardCache";

export default function InventoryScreen() {
  const { player } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<"packs" | "cards">("packs");
  const cards = getCachedCardsByExpansionId("base1");
  console.log("Inventory cards length:", cards.length);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Inventory
      </ThemedText>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "packs" && styles.tabActive]}
          onPress={() => setSelectedTab("packs")}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.tabText,
              selectedTab === "packs" && styles.tabTextActive,
            ]}
          >
            Packs
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "cards" && styles.tabActive]}
          onPress={() => setSelectedTab("cards")}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.tabText,
              selectedTab === "cards" && styles.tabTextActive,
            ]}
          >
            Cards
          </ThemedText>
        </TouchableOpacity>
      </View>

      {selectedTab === "packs" && (
        <ScrollView style={styles.content}>
          <View style={styles.packsGrid}>
            {Object.entries(player.packInventory).map(([packName, count]) => (
              <View key={packName} style={styles.packItem}>
                <View style={styles.packImagePlaceholder}>
                  <ThemedText style={styles.packNameText}>
                    {packName}
                  </ThemedText>
                </View>
                <ThemedText type="defaultSemiBold" style={styles.count}>
                  x{count}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {selectedTab === "cards" && (
        <ScrollView style={styles.content}>
          <View style={styles.cardsGrid}>
            {cards.map((card: any) => (
              <View key={card.id} style={styles.cardItem}>
                <Image
                  source={{ uri: card.images?.small }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "rgba(10, 126, 164, 0.2)",
  },
  tabText: {
    fontSize: 16,
    opacity: 0.6,
  },
  tabTextActive: {
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  packsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  packItem: {
    width: 120,
    alignItems: "center",
  },
  packImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#999",
    marginBottom: 8,
  },
  packNameText: {
    textAlign: "center",
    fontSize: 12,
  },
  count: {
    fontSize: 16,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardItem: {
    width: "33.3333%", // 3 columns
    padding: 4,
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 63 / 88, // typical card ratio, tweak if needed
    borderRadius: 4,
  },
});
