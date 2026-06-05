import { create } from 'zustand';

interface AppState {
  userId: string | null;
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'error';
  setUserId: (id: string | null) => void;
  setOnline: (online: boolean) => void;
  setSyncStatus: (status: 'synced' | 'syncing' | 'error') => void;
}

export const useAppStore = create<AppState>((set) => ({
  userId: null,
  isOnline: navigator.onLine,
  syncStatus: 'synced',
  setUserId: (id) => set({ userId: id }),
  setOnline: (online) => set({ isOnline: online }),
  setSyncStatus: (status) => set({ syncStatus: status }),
}));
