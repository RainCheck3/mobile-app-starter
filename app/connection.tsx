import { StyleSheet, Text } from "react-native";

import { ConnectionPanel } from "@/components/connection-panel";
import { Screen } from "@/components/screen";
import { useTheme } from "@/config/theme";

export default function ConnectionScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      <Text style={[styles.intro, { color: colors.muted }]}>
        A small check before your next step.
      </Text>
      <ConnectionPanel />
    </Screen>
  );
}

const styles = StyleSheet.create({ intro: { fontSize: 17, lineHeight: 27 } });
