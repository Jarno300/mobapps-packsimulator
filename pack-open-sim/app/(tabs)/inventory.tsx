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
import {
  Card,
  getFetchStatus,
  resetFetchStatus,
  fetchBaseSetCards,
} from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";

export default function InventoryScreen() {
  const { player } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<"packs" | "cards">("packs");
  const [cardCache, setCardCache] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCache = () => {
      const cache = getCardCache();
      const status = getFetchStatus();

      setIsLoading(status.isFetching);
      setError(status.fetchError?.message || null);
      setCardCache([...cache]);

      // Stop polling once fetched or errored
      if (status.hasFetched || status.fetchError) {
        return true;
      }
      return false;
    };

    if (!checkCache()) {
      // Poll until loaded
      const interval = setInterval(() => {
        if (checkCache()) {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Update cache when switching to cards tab
    if (selectedTab === "cards") {
      const cache = getCardCache();
      setCardCache([...cache]);
    }
  }, [selectedTab]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    resetFetchStatus();
    try {
      await fetchBaseSetCards();
      const cache = getCardCache();
      setCardCache([...cache]);
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Inventory
      </ThemedText>
      {renderInventoryTabs(selectedTab, setSelectedTab)}

      {selectedTab === "packs" && renderPackInventory(player)}

      {selectedTab === "cards" &&
        renderCardList(cardCache, isLoading, error, handleRetry)}
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

function renderCardList(
  cardCache: Card[],
  isLoading: boolean,
  error: string | null,
  onRetry: () => void
) {
  if (isLoading) {
    return (
      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyStateText}>Loading cards...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyState}>
        <ThemedText style={styles.errorText}>Failed to load cards</ThemedText>
        <ThemedText style={styles.debugText}>{error}</ThemedText>
        <TouchableOpacity style={styles.refreshButton} onPress={onRetry}>
          <ThemedText>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (cardCache.length === 0) {
    return (
      <View style={styles.emptyState}>
        <ThemedText style={styles.emptyStateText}>
          No cards available
        </ThemedText>
        <TouchableOpacity style={styles.refreshButton} onPress={onRetry}>
          <ThemedText>Refresh</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.content}>
      <View style={styles.cardsHeader}>
        <ThemedText style={styles.cardCount}>
          {cardCache.length} cards loaded
        </ThemedText>
      </View>
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
  cardsHeader: {
    marginBottom: 12,
  },
  cardCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardItem: {
    width: "33.3333%",
    padding: 4,
    alignItems: "center",
    minHeight: 120,
  },
  cardImage: {
    width: "100%",
    aspectRatio: 63 / 88,
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
  errorText: {
    textAlign: "center",
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 16,
    textAlign: "center",
  },
  refreshButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(10, 126, 164, 0.2)",
    borderRadius: 8,
  },
});
