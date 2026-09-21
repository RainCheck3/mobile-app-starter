import { useColorScheme } from "react-native";

const light = {
  background: "#F6F5F0",
  surface: "#FFFFFF",
  text: "#172B27",
  muted: "#546761",
  accent: "#186649",
  onAccent: "#FFFFFF",
  border: "#D6DFD8",
  error: "#A52B2B",
};

type Palette = { [Key in keyof typeof light]: string };

const dark: Palette = {
  background: "#101C19",
  surface: "#192A24",
  text: "#EEF5EF",
  muted: "#B2C4B8",
  accent: "#A3DFC0",
  onAccent: "#102C1F",
  border: "#384E41",
  error: "#FFAAAA",
};

export function useTheme() {
  const isDark = useColorScheme() === "dark";
  return { colors: isDark ? dark : light, isDark };
}
