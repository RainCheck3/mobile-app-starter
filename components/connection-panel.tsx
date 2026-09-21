import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/config/theme";
import { checkConnection, type HealthResult } from "@/lib/health";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: HealthResult }
  | { status: "error"; message: string };

export function ConnectionPanel() {
  const { colors } = useTheme();
  const [state, setState] = useState<State>({ status: "idle" });
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function check() {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setState({ status: "loading" });
    try {
      const result = await checkConnection(controller.signal);
      if (!controller.signal.aborted) setState({ status: "success", result });
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Please try again.",
        });
      }
    } finally {
      activeRequest.current = null;
    }
  }

  const loading = state.status === "loading";
  const title =
    state.status === "success"
      ? state.result.source === "demo"
        ? "Demo is ready"
        : "Connected"
      : state.status === "error"
        ? "Unable to connect"
        : loading
          ? "Checking connection…"
          : "Ready to check";

  const description =
    state.status === "success"
      ? state.result.source === "demo"
        ? "Simulated response. No network request was made."
        : "Your API is healthy and ready."
      : state.status === "error"
        ? state.message
        : "Run a quick check to see whether everything is ready.";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View accessibilityLiveRegion="polite" style={styles.status}>
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            { color: state.status === "error" ? colors.error : colors.text },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          {description}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: loading, busy: loading }}
        disabled={loading}
        onPress={() => void check()}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.accent,
            opacity: pressed || loading ? 0.7 : 1,
          },
        ]}
      >
        {loading && <ActivityIndicator color={colors.onAccent} />}
        <Text style={[styles.buttonText, { color: colors.onAccent }]}>
          {loading
            ? "Checking…"
            : state.status === "error"
              ? "Try again"
              : state.status === "success"
                ? "Check again"
                : "Check connection"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24, borderRadius: 20, borderWidth: 1, gap: 24 },
  status: { gap: 10 },
  title: { fontSize: 22, fontWeight: "600" },
  description: { fontSize: 16, lineHeight: 25 },
  button: {
    minHeight: 48,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
