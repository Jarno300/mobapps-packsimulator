import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/theme-context";
import { PlayerProvider } from "@/contexts/player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLoadExpansions } from "@/hooks/use-load-expansions";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const initialLoad = useLoadExpansions();

  if (initialLoad) {
    return (
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    );
  } else {
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
