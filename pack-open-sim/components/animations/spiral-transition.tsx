import { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SpiralTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  color?: string;
}

const NUM_BARS = 24;
const BAR_HEIGHT = Math.ceil(SCREEN_HEIGHT / NUM_BARS);
const STAGGER_DELAY = 40;
const ANIMATION_DURATION = 500;

function HorizontalBar({
  index,
  color,
  isActive,
}: {
  index: number;
  color: string;
  isActive: boolean;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      width.value = withDelay(
        index * STAGGER_DELAY,
        withTiming(SCREEN_WIDTH, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.quad),
        })
      );
    } else {
      width.value = 0;
    }
  }, [isActive]);

  const isFromRight = index % 2 === 1;

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    right: isFromRight ? 0 : undefined,
    left: isFromRight ? undefined : 0,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        animatedStyle,
        {
          backgroundColor: color,
          top: index * BAR_HEIGHT,
          height: BAR_HEIGHT + 1,
        },
      ]}
    />
  );
}

export function SpiralTransition({
  isActive,
  onComplete,
  color = "#000",
}: SpiralTransitionProps) {
  useEffect(() => {
    if (isActive) {
      const totalDuration = NUM_BARS * STAGGER_DELAY + ANIMATION_DURATION + 100;
      const timeout = setTimeout(() => {
        onComplete();
      }, totalDuration);

      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_BARS }).map((_, index) => (
        <HorizontalBar
          key={index}
          index={index}
          color={color}
          isActive={isActive}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  bar: {
    position: "absolute",
  },
});
