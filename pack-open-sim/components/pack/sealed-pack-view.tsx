import { Pressable, StyleSheet, Animated, Easing } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { PackImage } from "./pack-image";
import { BoosterPack } from "@/components/pokémon-related-components/booster-pack";
import { useRef, useEffect, useState } from "react";

interface SealedPackViewProps {
  pack: BoosterPack;
  onOpen: () => void;
}

export function SealedPackView({ pack, onOpen }: SealedPackViewProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const burstScaleAnim = useRef(new Animated.Value(0)).current;
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPress = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Pack explodes outward and fades
    Animated.parallel([
      // Scale up dramatically
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Rotate while opening
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Burst effect scale
      Animated.timing(burstScaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Fade out pack
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onOpen();
      });
    });
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "20deg"],
  });

  const burstOpacity = burstScaleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.6, 0],
  });

  return (
    <ThemedView style={styles.container}>
      {/* Burst effect - particles expanding outward */}
      <Animated.View
        style={[
          styles.burstParticle,
          {
            opacity: burstOpacity,
            transform: [
              {
                scale: burstScaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          },
        ]}
      />

      <Pressable onPress={handleOpenPress} style={styles.pressable}>
        <Animated.View
          style={[
            {
              transform: [
                { scale: scaleAnim },
                {
                  rotateZ: rotation,
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <PackImage packName={pack.name} size="large" />
        </Animated.View>
        {!isOpening && (
          <ThemedText style={styles.tapText}>Tap to open</ThemedText>
        )}
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
    overflow: "hidden",
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
  burstParticle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.5)",
    backgroundColor: "transparent",
  },
});
