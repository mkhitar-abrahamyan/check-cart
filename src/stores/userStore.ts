import { create } from 'zustand';

/** User Types */
export interface User {
  id: number;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

/** Mock SSR User Data - Simulates getting user from server */
const mockSSRUser: User = {
  id: 1,
  name: 'Donald McDuck',
  email: 'donald@mcduck.com',
  firstName: 'Donald',
  lastName: 'McDuck',
};

export const useUserStore = create<UserState>(set => ({
  user: mockSSRUser,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));
