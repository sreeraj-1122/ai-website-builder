import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { buildMuiTheme } from "@/lib/mui-theme";
import { useTheme } from "@/lib/theme-store";

export function MuiProviders({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => buildMuiTheme(theme), [theme]);
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
