import React, { useRef, useEffect } from "react";
import { Animated, Easing, StyleSheet, Dimensions, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FireworksProps {
  isActive: boolean;
  color?: string; // legacy single color support
  colors?: string[]; // preferred multi-color palette
  intensity?: "normal" | "high"; // controls particle count
}

interface ParticleMeta {
  id: number;
  animValue: Animated.Value;
  angle: number; // radians
  distance: number; // px
  size: number; // px
  delay: number; // ms
  duration: number; // ms
  originOffsetX: number; // px
  originOffsetY: number; // px
  color: string;
}

const Particle = ({ particle }: { particle: ParticleMeta }) => {
  const translateX = particle.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.cos(particle.angle) * particle.distance],
  });

  const translateY = particle.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.sin(particle.angle) * particle.distance],
  });

  const opacity = particle.animValue.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  const scale = particle.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      key={particle.id}
      style={[
        styles.particle,
        {
          backgroundColor: particle.color,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.8)",
          shadowColor: particle.color,
          shadowOpacity: 0.6,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
          transform: [
            { translateX: particle.originOffsetX },
            { translateY: particle.originOffsetY },
            { translateX },
            { translateY },
            { scale },
            { rotate: `${(particle.angle * 180) / Math.PI}deg` },
          ],
          opacity,
        },
      ]}
    />
  );
};

// Elongated motion trail from origin towards current particle position
const Trail = ({ particle }: { particle: ParticleMeta }) => {
  const trailOpacity = particle.animValue.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0.2, 0.6, 0.35, 0],
  });
  const scaleX = particle.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, 1],
  });
  const height = Math.max(2, Math.floor(particle.size * 0.5));
  const rotate = `${(particle.angle * 180) / Math.PI}deg`;
  return (
    <Animated.View
      style={[
        styles.trail,
        {
          width: particle.distance,
          height,
          backgroundColor: particle.color,
          opacity: trailOpacity,
          transform: [
            { translateX: particle.originOffsetX },
            { translateY: particle.originOffsetY },
            { rotate },
            { scaleX },
          ],
        },
      ]}
    />
  );
};

// Small sparks that appear near the end of a particle's life
const Sparks = ({
  particle,
  count = 2,
}: {
  particle: ParticleMeta;
  count?: number;
}) => {
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const angleOffset = ((i - (count - 1) / 2) * Math.PI) / 18; // ~±10° spread
    const sparkAngle = particle.angle + angleOffset;
    const factor = 0.65 + (i / Math.max(1, count - 1)) * 0.3; // 0.65..0.95

    const tx = particle.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.cos(sparkAngle) * particle.distance * factor],
    });
    const tyBase = particle.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.sin(sparkAngle) * particle.distance * factor],
    });
    // slight downward drift at end
    const tyDrift = particle.animValue.interpolate({
      inputRange: [0.6, 1],
      outputRange: [0, 12],
      extrapolate: "clamp",
    });

    const opacity = particle.animValue.interpolate({
      inputRange: [0, 0.6, 0.85, 1],
      outputRange: [0, 1, 1, 0],
    });
    const scale = particle.animValue.interpolate({
      inputRange: [0.6, 1],
      outputRange: [1, 0.6],
      extrapolate: "clamp",
    });
    const size = Math.max(2, Math.floor(particle.size * 0.5));

    elements.push(
      <Animated.View
        key={`s-${particle.id}-${i}`}
        style={[
          styles.spark,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: particle.color,
            shadowColor: particle.color,
            shadowOpacity: 0.5,
            shadowRadius: 4,
            transform: [
              { translateX: particle.originOffsetX },
              { translateY: particle.originOffsetY },
              { translateX: tx },
              { translateY: tyBase },
              { translateY: tyDrift },
              { scale },
            ],
            opacity,
          },
        ]}
      />
    );
  }
  return <>{elements}</>;
};

const DEFAULT_COLORS = [
  "#FF3B30", // red
  "#FF9500", // orange
  "#FFCC00", // yellow
  "#34C759", // green
  "#5AC8FA", // cyan
  "#007AFF", // blue
  "#5856D6", // indigo
  "#AF52DE", // purple
  "#FF2D55", // pink
  "#FFFFFF", // white
  "#FFD700", // gold
];

export function Fireworks({
  isActive,
  color = "#FFD700",
  colors,
  intensity = "high",
}: FireworksProps) {
  const particleRefs = useRef<ParticleMeta[]>([]);
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const flash = useRef(new Animated.Value(0)).current;
  const flashLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Initialize particles once
    if (particleRefs.current.length === 0) {
      const palette = (
        colors && colors.length > 0 ? colors : DEFAULT_COLORS
      ).concat(
        // ensure base color is represented too for continuity
        color ? [color] : []
      );
      const uniquePalette = Array.from(new Set(palette));

      const PARTICLE_COUNT = intensity === "high" ? 80 : 48;
      particleRefs.current = Array.from({ length: PARTICLE_COUNT }).map(
        (_, id) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 220 + Math.random() * 260; // 220 - 480
          const size = 6 + Math.random() * 12; // 6 - 18 px
          const delay = Math.floor(Math.random() * 600); // 0 - 600ms
          const duration = 850 + Math.floor(Math.random() * 1150); // 850 - 2000ms
          const originOffsetX = (Math.random() - 0.5) * 40; // -20 .. 20
          const originOffsetY = (Math.random() - 0.5) * 40; // -20 .. 20
          const chosenColor = uniquePalette[id % uniquePalette.length];
          return {
            id,
            animValue: new Animated.Value(0),
            angle,
            distance,
            size,
            delay,
            duration,
            originOffsetX,
            originOffsetY,
            color: chosenColor,
          } as ParticleMeta;
        }
      );
    }

    // Cleanup helpers
    const stopAll = () => {
      loopsRef.current.forEach((anim) => anim && anim.stop());
      loopsRef.current = [];
      flashLoopRef.current?.stop?.();
    };

    stopAll();

    if (isActive) {
      // Start center flash loop
      flash.setValue(0);
      const flashLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(flash, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(flash, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(flash, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      );
      flashLoop.start();
      flashLoopRef.current = flashLoop;

      // Start looping particles with staggered delays
      particleRefs.current.forEach((p, idx) => {
        p.animValue.setValue(0);
        const loop = Animated.loop(
          Animated.sequence([
            Animated.delay(p.delay),
            Animated.timing(p.animValue, {
              toValue: 1,
              duration: p.duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            // instant reset
            Animated.timing(p.animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
        loopsRef.current.push(loop);
        loop.start();
      });
    }

    return () => {
      stopAll();
    };
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Central flash pulse */}
      <Animated.View
        style={[
          styles.centerFlash,
          {
            transform: [
              {
                scale: flash.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 2.8],
                }),
              },
            ],
            opacity: flash.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0],
            }),
            borderColor: "#ffffff",
          },
        ]}
      />
      {/* Trails under the particles */}
      {particleRefs.current.map((particle) => (
        <Trail key={`t-${particle.id}`} particle={particle} />
      ))}
      {particleRefs.current.map((particle) => (
        <Particle key={`p-${particle.id}`} particle={particle} />
      ))}
      {/* End-of-burst sparks */}
      {particleRefs.current.map((particle) => (
        <Sparks key={`sp-${particle.id}`} particle={particle} count={2} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // behind card content (which uses zIndex 10)
  },
  particle: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2,
    left: SCREEN_WIDTH / 2,
  },
  trail: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2,
    left: SCREEN_WIDTH / 2,
    borderRadius: 2,
  },
  centerFlash: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    top: SCREEN_HEIGHT / 2 - 50,
    left: SCREEN_WIDTH / 2 - 50,
    borderWidth: 2,
  },
  spark: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2,
    left: SCREEN_WIDTH / 2,
  },
});
