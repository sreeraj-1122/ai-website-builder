import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  name: string;
  email: string;
  avatar: string;
  plan: "Free" | "Pro" | "Team";
  credits: number;
};

type State = {
  user: User;
  signOut: () => void;
  setUser: (u: Partial<User>) => void;
};

const DEFAULT_USER: User = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/120?u=john",
  plan: "Pro",
  credits: 245,
};

export const useUser = create<State>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      signOut: () => set({ user: DEFAULT_USER }),
      setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
    }),
    { name: "genweb-user" },
  ),
);
