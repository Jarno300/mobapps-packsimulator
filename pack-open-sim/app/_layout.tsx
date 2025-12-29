import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/theme-context";
import { PlayerProvider } from "@/contexts/player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchBaseSetCards } from "@/api/fetchCards";
import { usePlayer } from "@/contexts/player-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const player = usePlayer();

  useEffect(() => {
    fetchBaseSetCards().catch((error) => {
      console.error("Failed to fetch base set cards:", error);
    });
  }, []);

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <RootLayoutNav />
      </PlayerProvider>
    </ThemeProvider>
  );
}
