import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Screen } from "@/components/screen";
import { useTheme } from "@/config/theme";

export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        This screen doesn’t exist.
      </Text>
      <Link href="/" style={[styles.link, { color: colors.accent }]}>
        Return home
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "600" },
  link: { fontSize: 16, paddingVertical: 14 },
});
