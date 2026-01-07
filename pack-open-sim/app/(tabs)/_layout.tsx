import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { FONTS } from "@/constants/fonts";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePlayer } from "@/contexts/player-context";

const TAB_ICONS = {
  home: require("@/assets/images/pokeball.png"),
  shop: require("@/assets/images/pokecoin.png"),
  inventory: require("@/assets/images/inventory.png"),
  achievements: require("@/assets/images/starmie.png"),
  settings: require("@/assets/images/gear.png"),
};

function TabIcon({
  source,
  size = 26,
  focused,
}: {
  source: any;
  size?: number;
  focused: boolean;
}) {
  return (
    <View
      style={[styles.iconContainer, focused && styles.iconContainerFocused]}
    >
      <Image
        source={source}
        style={[
          styles.icon,
          {
            width: size,
            height: size,
            opacity: focused ? 1 : 0.6,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { player } = usePlayer();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isLoggedIn = !player.isLoggedIn;
  const isPackOpening = pathname.includes("pack-opening");
  const hideChrome = isLoggedIn || isPackOpening;

  return (
    <View style={styles.container}>
      <Tabs
        initialRouteName="index"
        backBehavior="initialRoute"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarLabelStyle: {
            fontFamily: FONTS.pokemon,
            marginTop: 4,
            fontSize: 6,
          },
          tabBarStyle: hideChrome
            ? { display: "none" }
            : {
                paddingTop: 8,
                paddingBottom: Math.max(10, insets.bottom),
                height: 70 + insets.bottom,
              },
        }}
      >
        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TAB_ICONS.inventory} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: "Shop",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TAB_ICONS.shop} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TAB_ICONS.home} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: "Achievements",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                source={TAB_ICONS.achievements}
                focused={focused}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={TAB_ICONS.settings} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    opacity: 1,
  },
});
