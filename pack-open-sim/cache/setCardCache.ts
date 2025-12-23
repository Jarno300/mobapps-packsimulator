import { Expansion, USED_EXPANSIONS } from "@/constants/expansions";
import { fetchCardsBySetId, Card } from "@/api/fetchCards";
import { ExpoConfigItem } from "expo-router/build/fork/getPathFromState-forks";

export type ExpansionCache = Record<string, Card[]>;

const expansionCache: ExpansionCache = {};

export async function initExpansionCache(): Promise<void> {
  for (const expansion of USED_EXPANSIONS) {
    try {
      const cards = await fetchCardsBySetId(expansion.expansionIdApi);
      expansionCache[expansion.expansionIdApi] = cards;
    } catch (e) {
      console.error(
        "Failed to load set with id: ",
        expansion.expansionIdApi,
        "error:",
        e
      );
      expansionCache[expansion.expansionIdApi] = [];
    }
  }
}

export function getCachedCardsByExpansionId(expansionId: string): Card[] {
  return expansionCache[expansionId] ?? [];
}
