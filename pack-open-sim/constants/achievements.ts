import { Player } from "@/contexts/player-context";

export interface AchievementConfig {
  id: string;
  title: string;
  subtitle: string;
  reward: number;
  condition: (player: Player) => boolean;
}

export const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: "pack-opener-1",
    title: "Pack Opener I",
    subtitle: "Open 5 packs - 500$",
    reward: 500,
    condition: (player) => player.openedPacks >= 5,
  },
  {
    id: "pack-opener-2",
    title: "Pack Opener II",
    subtitle: "Open 10 packs - 1000$",
    reward: 1000,
    condition: (player) => player.openedPacks >= 10,
  },
  {
    id: "pack-opener-3",
    title: "Pack Opener III",
    subtitle: "Open 25 packs - 2500$",
    reward: 2500,
    condition: (player) => player.openedPacks >= 25,
  },
  {
    id: "pack-opener-4",
    title: "Pack Opener IV",
    subtitle: "Open 50 packs - 5000$",
    reward: 5000,
    condition: (player) => player.openedPacks >= 50,
  },
  {
    id: "pack-opener-5",
    title: "Pack Opener V",
    subtitle: "Open 100 packs - 10000$",
    reward: 10000,
    condition: (player) => player.openedPacks >= 100,
  },
  {
    id: "holo-collector-1",
    title: "Holo Rare Collector I",
    subtitle: "Obtain 1 holo rare card - 500$",
    reward: 500,
    condition: (player) => player.obtainedRaritiesTotal.holoRare >= 1,
  },
  {
    id: "holo-collector-2",
    title: "Holo Rare Collector II",
    subtitle: "Obtain 5 holo rare cards - 1000$",
    reward: 1000,
    condition: (player) => player.obtainedRaritiesTotal.holoRare >= 5,
  },
  {
    id: "holo-collector-3",
    title: "Holo Rare Collector III",
    subtitle: "Obtain 10 holo rare cards - 1500$",
    reward: 1500,
    condition: (player) => player.obtainedRaritiesTotal.holoRare >= 10,
  },
  {
    id: "holo-collector-4",
    title: "Holo Rare Collector IV",
    subtitle: "Obtain 20 holo rare cards - 2000$",
    reward: 2000,
    condition: (player) => player.obtainedRaritiesTotal.holoRare >= 20,
  },
];
