import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PlayerProvider } from "@/contexts/player-context";
import { AudioProvider } from "@/contexts/audio-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchBaseSetCards } from "@/api/fetchCards";
import { DataConflictModal } from "@/components/ui/data-conflict-modal";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
      <DataConflictModal />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    "Pokemon-RBYGSC": require("@/assets/fonts/PKMN RBYGSC.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timeout = setTimeout(() => {
        setAppIsReady(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
            <AudioProvider>
              <RootLayoutNav />
            </AudioProvider>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}
