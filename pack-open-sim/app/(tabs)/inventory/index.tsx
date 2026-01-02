import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { usePlayer } from "@/contexts/player-context";
import {
  Card,
  getFetchStatus,
  resetFetchStatus,
  fetchBaseSetCards,
} from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";



const PACK_IMAGES: Record<string, ReturnType<typeof require>> = {
  "Booster-Pack-Charizard": require("@/assets/images/Booster-Pack-Charizard.png"),
  "Booster-Pack-Blastoise": require("@/assets/images/Booster-Pack-Blastoise.png"),
  "Booster-Pack-Bulbasaur": require("@/assets/images/Booster-Pack-Bulbasaur.png"),
};

type TabType = "packs" | "cards";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

interface CardGridProps {
  cards: Card[];
  ownedCards: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

interface PackGridProps {
  packs: BoosterPack[];
  onPackPress: (packId: number) => void;
}

function useCardCache() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCache = useCallback(() => {
    const cache = getCardCache();
    setCards([...cache]);
  }, []);

  const checkStatus = useCallback(() => {
    const status = getFetchStatus();
    setIsLoading(status.isFetching);
    setError(status.fetchError?.message || null);
    refreshCache();
    return status.hasFetched || status.fetchError !== null;
  }, [refreshCache]);

  const retry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    resetFetchStatus();
    try {
      await fetchBaseSetCards();
      refreshCache();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCache]);

  useEffect(() => {
    if (!checkStatus()) {
      const interval = setInterval(() => {
        if (checkStatus()) {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [checkStatus]);

  return { cards, isLoading, error, retry, refreshCache };
}

function TabButton({ label, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.tabActive]}
      onPress={onPress}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[styles.tabText, isActive && styles.tabTextActive]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function InventoryTabs({
  selectedTab,
  onTabChange,
}: {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  return (
    <View style={styles.tabs}>
      <TabButton
        label="Packs"
        isActive={selectedTab === "packs"}
        onPress={() => onTabChange("packs")}
      />
      <TabButton
        label="Cards"
        isActive={selectedTab === "cards"}
        onPress={() => onTabChange("cards")}
      />
    </View>
  );
}

function CardItem({ card, ownedCount }: { card: Card; ownedCount: number }) {
  const isOwned = ownedCount > 0;
  const router = useRouter();
  console.log(isOwned)

  return (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => {
        if (!isOwned) return;

        router.push({
          pathname: "/(tabs)/inventory/card-info",
          params: { cardId: String(card.id) },
        });
      }}
    >
      <View style={styles.cardImageContainer}>
        {card.image ? (
          <Image
            source={
              isOwned
                ? { uri: card.image }
                : require("@/assets/images/Back-Of-Card.png")
            }
            style={[styles.cardImage, !isOwned && styles.cardImageUnowned]}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[styles.cardPlaceholder, !isOwned && styles.cardUnowned]}
          >
            <ThemedText style={styles.cardNameText} numberOfLines={2}>
              {card.name || "Unknown Card"}
            </ThemedText>
          </View>
        )}
        {isOwned && (
          <View style={styles.ownedBadge}>
            <ThemedText style={styles.ownedBadgeText}>x{ownedCount}</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function CardGrid({
  cards,
  ownedCards,
  isLoading,
  error,
  onRetry,
}: CardGridProps) {
  if (isLoading) {
    return <EmptyState message="Loading cards..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load cards"
        details={error}
        onRetry={onRetry}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        message="No cards available"
        onAction={onRetry}
        actionLabel="Refresh"
      />
    );
  }

  const ownedCount = Object.keys(ownedCards).length;

  return (
    <ScrollView style={styles.content}>
      <View style={styles.cardsHeader}>
        <ThemedText style={styles.cardCount}>
          {ownedCount} / {cards.length} cards collected
        </ThemedText>
      </View>
      <View style={styles.cardsGrid}>
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            ownedCount={ownedCards[card.id] || 0}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Replace the PackItem component with this:
function PackItem({
  pack,
  onPress,
}: {
  pack: BoosterPack;
  onPress: () => void;
}) {
  const packImage = PACK_IMAGES[pack.name];

  return (
    <Pressable style={styles.packItem} onPress={onPress}>
      {packImage ? (
        <Image source={packImage} style={styles.boosterPackImage} />
      ) : (
        <View style={styles.packImagePlaceholder}>
          <ThemedText style={styles.packNameText}>{pack.name}</ThemedText>
        </View>
      )}
      <ThemedText type="defaultSemiBold" style={styles.packStatus}>
        {pack.isOpened ? "Opened" : "Sealed"}
      </ThemedText>
    </Pressable>
  );
}

// Replace the broken PackGrid with this clean version:
function PackGrid({ packs, onPackPress }: PackGridProps) {
  if (packs.length === 0) {
    return <EmptyState message="No packs in inventory" />;
  }

  return (
    <ScrollView style={styles.content}>
      <View style={styles.packsGrid}>
        {packs.map((pack) => (
          <PackItem
            key={pack.id}
            pack={pack}
            onPress={() => onPackPress(pack.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// =============================================================================
// Main Screen
// =============================================================================

export default function InventoryScreen() {
  const router = useRouter();
  const { player } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<TabType>("packs");
  const { cards, isLoading, error, retry, refreshCache } = useCardCache();

  // Refresh card cache when switching to cards tab
  useEffect(() => {
    if (selectedTab === "cards") {
      refreshCache();
    }
  }, [selectedTab, refreshCache]);

  const handlePackPress = useCallback(
    (packId: number) => {
      router.push({
        pathname: "/(tabs)/inventory/pack-opening",
        params: { packId: String(packId) },
      });
    },
    [router]
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Inventory
      </ThemedText>

      <InventoryTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {selectedTab === "packs" && (
        <PackGrid packs={player.packInventory} onPackPress={handlePackPress} />
      )}

      {selectedTab === "cards" && (
        <CardGrid
          cards={cards}
          ownedCards={player.ownedCards}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
        />
      )}
    </ThemedView>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  // Add this style (replace boosterPackStyle):
  boosterPackImage: {
    width: 100,
    height: 180,
    resizeMode: "contain",
    marginBottom: 8,
  },

  // Tabs
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

  // Content
  content: {
    flex: 1,
  },

  // Packs
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
  packStatus: {
    fontSize: 16,
  },

  // Cards
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
    justifyContent: "center",

  },
  cardImageContainer: {
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "auto",
    aspectRatio: 63 / 88,
    borderRadius: 4,
    backgroundColor: "#ECD556",
  },
  cardImageUnowned: {
    opacity: 1,
    backgroundColor: "none"

  },
  cardPlaceholder: {
    width: "100%",
    aspectRatio: 63 / 88,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    // padding: 8,
    borderWidth: 1,
  },
  cardUnowned: {
    opacity: 0.3,
  },
  cardNameText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  ownedBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  ownedBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
