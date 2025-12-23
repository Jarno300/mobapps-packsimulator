import { USED_EXPANSIONS } from "@/constants/expansions";
import { fetchCardsBySetId, Card } from "@/api/fetchCards";

export type ExpansionCache = Record<string, Card[]>;

const expansionCache: ExpansionCache = {};

export async function initExpansionCache(): Promise<void> {
  let totalSets = 0;
  let setNames = "";

  for (const expansion of USED_EXPANSIONS) {
    try {
      const cards = await fetchCardsBySetId(expansion.expansionIdApi);
      expansionCache[expansion.expansionIdApi] = cards;
      totalSets++;
      setNames += `${expansion.expansionIdApi} `;
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
  console.log(`Loaded ${totalSets} sets: ${setNames}).`);
}

export function getCachedCardsByExpansionId(expansionId: string): Card[] {
  console.log(
    `Getting ${expansionCache[expansionId].length} cards for expansionId: ${expansionId}`
  );
  return expansionCache[expansionId];
}
