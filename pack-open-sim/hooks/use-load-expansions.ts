import { useEffect, useState } from "react";
import { USED_EXPANSIONS } from "@/constants/expansions";
import { fetchCardsBySetId } from "@/api/fetchCards";
import { initExpansionCache } from "@/cache/setCardCache";

export function useLoadExpansions() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await initExpansionCache();
      } catch (e) {
        console.error("Failed to initialize expansion cache", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return loading;
}
