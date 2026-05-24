import { createTheme } from "@mui/material/styles";

export function buildMuiTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#8b5cf6" : "#6366f1" },
      secondary: { main: isDark ? "#ec4899" : "#a855f7" },
      background: {
        default: isDark ? "#09090b" : "#ffffff",
        paper: isDark ? "#111827" : "#ffffff",
      },
      divider: isDark ? "#27272a" : "#e5e7eb",
      text: {
        primary: isDark ? "#fafafa" : "#111827",
        secondary: isDark ? "#a1a1aa" : "#6b7280",
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
      h1: { letterSpacing: "-0.03em", fontWeight: 700 },
      h2: { letterSpacing: "-0.025em", fontWeight: 700 },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 10, paddingInline: 16, paddingBlock: 8 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
}
