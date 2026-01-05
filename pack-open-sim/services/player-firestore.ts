import { Player } from "@/contexts/player-context";
import {
  getDocument,
  setDocument,
  updateDocument,
  subscribeToDocument,
} from "./firestore";

const COLLECTION_NAME = "players";

// Remove undefined values recursively (Firestore doesn't accept undefined)
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item));
  }

  if (typeof obj === "object" && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        sanitized[key] = sanitizeForFirestore(value);
      }
    }
    return sanitized;
  }

  return obj;
}

export async function savePlayerToFirestore(userId: string, player: Player) {
  try {
    const sanitizedPlayer = sanitizeForFirestore({
      ...player,
      updatedAt: new Date().toISOString(),
    });
    await setDocument(COLLECTION_NAME, userId, sanitizedPlayer);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error saving player:", error);
    return { success: false, error: error.message };
  }
}

export async function getPlayerFromFirestore(userId: string) {
  try {
    const player = await getDocument<Player>(COLLECTION_NAME, userId);
    return { player, error: null };
  } catch (error: any) {
    return { player: null, error: error.message };
  }
}

export async function updatePlayerInFirestore(
  userId: string,
  updates: Partial<Player>
) {
  try {
    const sanitizedUpdates = sanitizeForFirestore({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    await updateDocument(COLLECTION_NAME, userId, sanitizedUpdates);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating player:", error);
    return { success: false, error: error.message };
  }
}

export function subscribeToPlayerUpdates(
  userId: string,
  callback: (player: Player | null) => void
) {
  return subscribeToDocument<Player>(COLLECTION_NAME, userId, callback);
}
