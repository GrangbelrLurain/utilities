import { User } from "@/schemas/user";
import { create } from "zustand";

type TUserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
};

export const userStore = create<TUserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
