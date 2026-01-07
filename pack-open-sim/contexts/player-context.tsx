import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./auth-context";
import {
  savePlayerToFirestore,
  getPlayerFromFirestore,
} from "@/services/player-firestore";

export interface Player {
  achievements: string[];
  username: string;
  isLoggedIn: boolean;
  money: number;
  openedPacks: number;
  luck: number;
  obtainedRaritiesTotal: {
    energy: number;
    common: number;
    uncommon: number;
    rare: number;
    holoRare: number;
  };
  packInventory: BoosterPack[];
  ownedCards: Record<string, number>;
}

const defaultPlayer: Player = {
  achievements: [],
  username: "",
  isLoggedIn: false,
  money: 2000,
  openedPacks: 0,
  luck: 0,
  obtainedRaritiesTotal: {
    energy: 0,
    common: 0,
    uncommon: 0,
    rare: 0,
    holoRare: 0,
  },
  packInventory: [],
  ownedCards: {},
};

export interface DataConflict {
  localPlayer: Player;
  cloudPlayer: Player;
}

interface PlayerContextValue {
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;
  resetLocalPlayerData: () => Promise<void>;
  isLoading: boolean;
  dataConflict: DataConflict | null;
  resolveConflict: (choice: "local" | "cloud") => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);
const STORAGE_KEY = "@player";

// Check if player has meaningful progress
function hasProgress(player: Player): boolean {
  return (
    player.isLoggedIn ||
    player.openedPacks > 0 ||
    player.packInventory.length > 0 ||
    Object.keys(player.ownedCards).length > 0 ||
    player.money !== 2000
  );
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>(defaultPlayer);
  const [isLoading, setIsLoading] = useState(true);
  const [dataConflict, setDataConflict] = useState<DataConflict | null>(null);
  const { user } = useAuth();

  // Load player data
  useEffect(() => {
    const loadPlayer = async () => {
      setIsLoading(true);

      if (user) {
        // Get both local and cloud data
        const { player: cloudPlayer } = await getPlayerFromFirestore(user.uid);

        let localPlayer: Player | null = null;
        try {
          const localValue = await AsyncStorage.getItem(STORAGE_KEY);
          if (localValue) {
            localPlayer = validatePlayer(JSON.parse(localValue));
          }
        } catch {
          // Ignore local storage errors
        }

        const hasLocalProgress = localPlayer && hasProgress(localPlayer);
        const hasCloudProgress = cloudPlayer && hasProgress(cloudPlayer);

        if (hasLocalProgress && hasCloudProgress) {
          // Both have progress - show conflict dialog
          setDataConflict({
            localPlayer: localPlayer!,
            cloudPlayer: validatePlayer(cloudPlayer),
          });
          // Temporarily show cloud data while user decides
          setPlayer(validatePlayer(cloudPlayer));
        } else if (hasCloudProgress) {
          // Only cloud has data
          setPlayer(validatePlayer(cloudPlayer));
        } else if (hasLocalProgress) {
          // Only local has data - upload it to cloud
          const playerWithUsername = {
            ...localPlayer!,
            username: localPlayer!.username || user.displayName || "Trainer",
            isLoggedIn: true,
          };
          setPlayer(playerWithUsername);
          await savePlayerToFirestore(user.uid, playerWithUsername);
          // Clear local storage after uploading
          await AsyncStorage.removeItem(STORAGE_KEY);
        } else {
          // Neither has data - create new with onboarding complete (Google login = already authenticated)
          const newPlayer = {
            ...defaultPlayer,
            username: user.displayName || "Trainer",
            isLoggedIn: true,
          };
          setPlayer(newPlayer);
          await savePlayerToFirestore(user.uid, newPlayer);
        }
      } else {
        // Not logged in - use local storage
        try {
          const value = await AsyncStorage.getItem(STORAGE_KEY);
          if (value) {
            const parsed = JSON.parse(value);
            const validatedPlayer = validatePlayer(parsed);
            setPlayer(validatedPlayer);
          }
        } catch {
          setPlayer(defaultPlayer);
        }
      }

      setIsLoading(false);
    };

    loadPlayer();
  }, [user]);

  const validatePlayer = (parsed: any): Player => {
    if (parsed.packInventory && !Array.isArray(parsed.packInventory)) {
      parsed.packInventory = [];
    }

    if (
      !parsed.ownedCards ||
      typeof parsed.ownedCards !== "object" ||
      Array.isArray(parsed.ownedCards)
    ) {
      parsed.ownedCards = {};
    }

    return { ...defaultPlayer, ...parsed };
  };

  const resolveConflict = useCallback(
    async (choice: "local" | "cloud") => {
      if (!dataConflict || !user) return;

      const resolvedPlayer =
        choice === "local"
          ? dataConflict.localPlayer
          : dataConflict.cloudPlayer;

      setPlayer(resolvedPlayer);
      await savePlayerToFirestore(user.uid, resolvedPlayer);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setDataConflict(null);
    },
    [dataConflict, user]
  );

  const updatePlayer = useCallback(
    async (updates: Partial<Player>) => {
      const updated = { ...player, ...updates };
      setPlayer(updated);

      if (user) {
        await savePlayerToFirestore(user.uid, updated);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    },
    [player, user]
  );

  const resetLocalPlayerData = useCallback(async () => {
    setPlayer(defaultPlayer);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        player,
        updatePlayer,
        isLoading,
        dataConflict,
        resolveConflict,
        resetLocalPlayerData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext)!;
}
