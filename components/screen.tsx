import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/config/theme";

export function Screen({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24 },
  content: { width: "100%", maxWidth: 560, alignSelf: "center", gap: 24 },
});
