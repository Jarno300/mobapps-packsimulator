import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";

const HEADER_COLORS = {
  dark: { background: "#151718", tint: "#fff" },
  light: { background: "#fff", tint: "#000" },
} as const;

export default function InventoryLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = HEADER_COLORS[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.tint,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="pack-opening"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
