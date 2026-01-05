import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Text,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PackImage } from "@/components/pack/pack-image";
import { PokeBorder } from "@/components/ui/poke-border";
import { AppHeader } from "@/components/ui/app-header";
import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "@/contexts/theme-context";
import { THEME_COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import {
  Card,
  getFetchStatus,
  resetFetchStatus,
  fetchBaseSetCards,
} from "@/api/fetchCards";
import { getCardCache } from "@/cache/setCardCache";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";

type TabType = "packs" | "cards";

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

function TabButton({
  label,
  isActive,
  onPress,
  isDark,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        {
          backgroundColor: isActive ? colors.card : "transparent",
          borderColor: colors.border,
          borderWidth: isActive ? 2 : 1,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          {
            color: isActive ? colors.textPrimary : colors.textMuted,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function InventoryTabs({
  selectedTab,
  onTabChange,
  isDark,
}: {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
  isDark: boolean;
}) {
  return (
    <View style={styles.tabs}>
      <TabButton
        label="Packs"
        isActive={selectedTab === "packs"}
        onPress={() => onTabChange("packs")}
        isDark={isDark}
      />
      <TabButton
        label="Cards"
        isActive={selectedTab === "cards"}
        onPress={() => onTabChange("cards")}
        isDark={isDark}
      />
    </View>
  );
}

function CardItem({
  card,
  ownedCount,
  isDark,
}: {
  card: Card;
  ownedCount: number;
  isDark: boolean;
}) {
  const isOwned = ownedCount > 0;
  const router = useRouter();
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <TouchableOpacity
      style={styles.cardItem}
      disabled={!isOwned}
      onPress={() => {
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
            style={[
              styles.cardPlaceholder,
              { borderColor: colors.border },
              !isOwned && styles.cardUnowned,
            ]}
          >
            <Text
              style={[styles.cardNameText, { color: colors.textPrimary }]}
              numberOfLines={2}
            >
              {card.name || "Unknown Card"}
            </Text>
          </View>
        )}
        {isOwned && (
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedBadgeText}>x{ownedCount}</Text>
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
  isDark,
}: {
  cards: Card[];
  ownedCards: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  isDark: boolean;
}) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

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
    <ScrollView
      style={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <PokeBorder borderColor={colors.border}>
        <View style={[styles.gridContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Collection
          </Text>
          <Text style={[styles.cardCount, { color: colors.textSecondary }]}>
            {ownedCount} / {cards.length} cards collected
          </Text>
          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                ownedCount={ownedCards[card.id] || 0}
                isDark={isDark}
              />
            ))}
          </View>
        </View>
      </PokeBorder>
    </ScrollView>
  );
}

function PackItem({
  pack,
  onPress,
}: {
  pack: BoosterPack;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.packItem} onPress={onPress}>
      <PackImage packName={pack.name} size="small" />
    </Pressable>
  );
}

function PackGrid({
  packs,
  onPackPress,
  isDark,
}: {
  packs: BoosterPack[];
  onPackPress: (packId: number) => void;
  isDark: boolean;
}) {
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  if (packs.length === 0) {
    return (
      <EmptyState
        message="No packs in inventory. 
      Grab a pack from the shop!"
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <PokeBorder borderColor={colors.border}>
        <View style={[styles.gridContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Booster Packs
          </Text>
          <View style={styles.packsGrid}>
            {packs.map((pack) => (
              <PackItem
                key={pack.id}
                pack={pack}
                onPress={() => onPackPress(pack.id)}
              />
            ))}
          </View>
        </View>
      </PokeBorder>
    </ScrollView>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const { player } = usePlayer();
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<TabType>("packs");
  const { cards, isLoading, error, retry, refreshCache } = useCardCache();

  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Inventory
        </Text>

        <InventoryTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          isDark={isDark}
        />

        {selectedTab === "packs" && (
          <PackGrid
            packs={player.packInventory}
            onPackPress={handlePackPress}
            isDark={isDark}
          />
        )}

        {selectedTab === "cards" && (
          <CardGrid
            cards={cards}
            ownedCards={player.ownedCards}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            isDark={isDark}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.pokemon,
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
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.pokemon,
  },
  scrollContent: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.pokemon,
    marginBottom: 8,
  },
  packsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  packItem: {
    width: 100,
    alignItems: "center",
  },
  cardCount: {
    fontSize: 11,
    fontFamily: FONTS.pokemon,
    marginBottom: 12,
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
    backgroundColor: "transparent",
  },
  cardPlaceholder: {
    width: "100%",
    aspectRatio: 63 / 88,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  cardUnowned: {
    opacity: 0.3,
  },
  cardNameText: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: FONTS.pokemon,
  },
  ownedBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  ownedBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: FONTS.pokemon,
  },
});
