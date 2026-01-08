import { useRef, useEffect } from "react";
import { Animated, Easing, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PulseGradientBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
  currentIndex?: number;
}

export function PulseGradientBackground({
  primaryColor,
  secondaryColor,
  currentIndex,
}: PulseGradientBackgroundProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulseAnim.setValue(0);
    glowAnim.setValue(0);
    pulseAnim2.setValue(0);

    // Main pulse animation
    const mainPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    // Secondary pulse - offset
    const secondaryPulse = Animated.loop(
      Animated.sequence([
        // Use a delay by running a timing animation with no value change
        Animated.timing(new Animated.Value(0), {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(pulseAnim2, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim2, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    mainPulse.start();
    secondaryPulse.start();
    glowAnimation.start();

    return () => {
      mainPulse.stop();
      secondaryPulse.stop();
      glowAnimation.stop();
    };
  }, [currentIndex]);

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [primaryColor, secondaryColor],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.5, 0.2],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const glow2Opacity = pulseAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0],
  });

  const glow2Scale = pulseAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <>
      <Animated.View style={[styles.container, { backgroundColor }]} />

      {/* Main glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
            backgroundColor: primaryColor,
          },
        ]}
      />

      {/* Secondary glow for layered effect */}
      <Animated.View
        style={[
          styles.glowSecondary,
          {
            opacity: glow2Opacity,
            transform: [{ scale: glow2Scale }],
            backgroundColor: secondaryColor,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  glow: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    top: "50%",
    left: "50%",
    marginLeft: -250,
    marginTop: -250,
    zIndex: 1,
  },
  glowSecondary: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    bottom: "-20%",
    right: "-15%",
    zIndex: 1,
  },
});
