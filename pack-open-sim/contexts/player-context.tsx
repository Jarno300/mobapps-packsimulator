import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Player {
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
  collectedCards: number[];
}

const defaultPlayer: Player = {
  username: "DefaultPlayerName",
  money: 0,
  openedPacks: 0,
  luck: 0,
  obtainedRaritiesTotal: {
    energy: 0,
    common: 0,
    uncommon: 0,
    rare: 0,
    holoRare: 0,
  },
  collectedCards: [],
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
          setPlayer({ ...defaultPlayer, ...JSON.parse(value) });
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

  // browser console debugging: type window.player or window.updatePlayer({field: value})
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
