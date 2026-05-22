import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
}

const apply = (t: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  try { localStorage.setItem("theme", t); } catch {}
};

const initial: Theme =
  typeof window !== "undefined"
    ? ((localStorage.getItem("theme") as Theme) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))
    : "dark";

if (typeof window !== "undefined") apply(initial);

export const useTheme = create<ThemeState>((set) => ({
  theme: initial,
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === "dark" ? "light" : "dark";
      apply(next);
      return { theme: next };
    }),
  set: (t) => {
    apply(t);
    set({ theme: t });
  },
}));
