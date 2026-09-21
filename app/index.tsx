import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { useTheme } from "@/config/theme";

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={[styles.eyebrow, { color: colors.accent }]}>
          MAKE A START
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          A little foundation.{"\n"}A lot of possibility.
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Your next idea starts here. Keep it simple, make it useful, and build
          something people love.
        </Text>
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[styles.cardTitle, { color: colors.text }]}
        >
          Start with a connection
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Try the example flow. The starter works in offline demo mode until you
          connect a backend.
        </Text>
        <Link
          href="/connection"
          style={[styles.link, { color: colors.accent }]}
        >
          Open connection check →
        </Link>
      </View>
      <Text style={[styles.caption, { color: colors.muted }]}>
        Small steps. Something real.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { paddingTop: 24, gap: 18 },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  title: { fontSize: 36, lineHeight: 42, fontWeight: "700", letterSpacing: -1 },
  body: { fontSize: 16, lineHeight: 26 },
  card: { padding: 24, borderRadius: 20, borderWidth: 1, gap: 12 },
  cardTitle: { fontSize: 21, fontWeight: "600" },
  link: { paddingVertical: 14, fontSize: 16, fontWeight: "600" },
  caption: { fontSize: 13, textAlign: "center", marginTop: 8 },
});
