import { User } from '@Entities/user/schemas/user';
import { create } from 'zustand';

type TUserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
};

export const userStore = create<TUserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
