import { create } from "zustand";

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
  plan?: string;
  planType?: string;
  credits?: number;
};

type State = {
  user: User | null;
  signOut: () => void;
  setUser: (u: User | null) => void;
};

export const useUser = create<State>()((set) => ({
  user: null,
  signOut: () => set({ user: null }),
  setUser: (u) => set({ user: u }),
}));
