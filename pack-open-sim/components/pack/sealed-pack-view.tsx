import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { PackImage } from "./pack-image";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";

interface SealedPackViewProps {
  pack: BoosterPack;
  onOpen: () => void;
}

export function SealedPackView({ pack, onOpen }: SealedPackViewProps) {
  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onOpen} style={styles.pressable}>
        <PackImage packName={pack.name} size="large" />
        <ThemedText style={styles.tapText}>Tap to open</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pressable: {
    alignItems: "center",
  },
  tapText: {
    marginTop: 24,
    fontSize: 18,
    opacity: 0.7,
    fontWeight: "600",
  },
});
