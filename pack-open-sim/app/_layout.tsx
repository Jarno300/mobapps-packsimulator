import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/theme-context";
import { PlayerProvider } from "@/contexts/player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchBaseSetCards } from "@/api/fetchCards";
import { usePlayer } from "@/contexts/player-context";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

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
  const [fontsLoaded] = useFonts({
    "Pokemon-RBYGSC": require("@/assets/fonts/PKMN RBYGSC.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <PlayerProvider>
        <RootLayoutNav />
      </PlayerProvider>
    </ThemeProvider>
  );
}
