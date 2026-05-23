import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  init: () => void;
  toggle: () => void;
  set: (t: Theme) => void;
}

const apply = (t: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch {}
};

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initial: Theme = "dark";

export const useTheme = create<ThemeState>((set) => ({
  theme: initial,
  init: () => {
    const preferred = getPreferredTheme();
    apply(preferred);
    set({ theme: preferred });
  },
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
