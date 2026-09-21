import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/config/theme";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Mobile Starter" }} />
        <Stack.Screen name="connection" options={{ title: "Connection" }} />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </>
  );
}
