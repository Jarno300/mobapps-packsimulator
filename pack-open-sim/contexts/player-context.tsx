import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Player {
  achievements: string[];
  username: string;
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
  username: "DefaultPlayerName",
  money: 10000,
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

interface PlayerContextValue {
  player: Player;
  updatePlayer: (updates: Partial<Player>) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);
const STORAGE_KEY = "@player";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>(defaultPlayer);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        try {
          const parsed = JSON.parse(value);

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

          setPlayer({ ...defaultPlayer, ...parsed });
        } catch {
          setPlayer(defaultPlayer);
        }
      }
    });
  }, []);

  const updatePlayer = async (updates: Partial<Player>) => {
    const updated = { ...player, ...updates };
    setPlayer(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).player = player;
      (window as any).updatePlayer = updatePlayer;
    }
  }, [player, updatePlayer]);

  return (
    <PlayerContext.Provider value={{ player, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext)!;
}
