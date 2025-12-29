import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useState, useEffect } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Player, usePlayer } from "@/contexts/player-context";
import { Card } from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";

export default function InventoryScreen() {
  const { player } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<"packs" | "cards">("packs");
  const [cardCache, setCardCache] = useState<Card[]>([]);

  useEffect(() => {
    // Update card cache when component mounts
    const cache = getCardCache();
    setCardCache([...cache]);
  }, []);

  useEffect(() => {
    // Update cache when switching to cards tab
    if (selectedTab === "cards") {
      const cache = getCardCache();
      setCardCache([...cache]);
    }
  }, [selectedTab]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Inventory
      </ThemedText>
      {renderInventoryTabs(selectedTab, setSelectedTab)}

      {selectedTab === "packs" && renderPackInventory(player)}

      {selectedTab === "cards" && renderCardList(cardCache)}
    </ThemedView>
  );
}

function renderInventoryTabs(selectedTab: string, setSelectedTab: any) {
  return (
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
  );
}

function renderCardList(cardCache: Card[]) {
  return (
    <ScrollView style={styles.content}>
      {cardCache.length > 0 && cardCache[0] && !cardCache[0].image && (
        <View style={styles.debugInfo}>
          <ThemedText style={styles.debugText}>
            Debug: First card image structure:{" "}
            {JSON.stringify(cardCache[0].image || "No images property")}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            First card keys: {Object.keys(cardCache[0]).join(", ")}
          </ThemedText>
        </View>
      )}
      {cardCache.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            No cards loaded yet. Cards are being fetched...
          </ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Cache size: {getCardCache().length}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.cardsGrid}>
          {cardCache.map((card: Card) => {
            const imageUri = card.image;
            return (
              <View key={card.id} style={styles.cardItem}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.cardImage}
                    resizeMode="contain"
                    onError={() => {}}
                  />
                ) : (
                  <View style={styles.cardPlaceholder}>
                    <ThemedText style={styles.cardNameText} numberOfLines={2}>
                      {card.name || "Unknown Card"}
                    </ThemedText>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

function renderPackInventory(player: Player) {
  return (
    <ScrollView style={styles.content}>
      <View style={styles.packsGrid}>
        {Object.entries(player.packInventory).map(([packName, count]) => (
          <View key={packName} style={styles.packItem}>
            <View style={styles.packImagePlaceholder}>
              <ThemedText style={styles.packNameText}>{packName}</ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.count}>
              x{count}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
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
    minHeight: 120,
  },
  cardImage: {
    width: "100%",
    aspectRatio: 63 / 88, // typical card ratio, tweak if needed
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  cardPlaceholder: {
    width: "100%",
    aspectRatio: 63 / 88,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardNameText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 10,
  },
  refreshButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
    borderRadius: 8,
  },
  debugInfo: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    marginBottom: 10,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
