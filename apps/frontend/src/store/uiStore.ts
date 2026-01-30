import { create } from 'zustand';

interface UIState {
  isModifierModalOpen: boolean;
  isPaymentModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  activeCategoryId: number | null;
  modifierModalData: { product: any; existingItem?: any } | null; // Typed loosely here, refactoring to shared types recommended
  searchQuery: string;
  notifications: { id: string; message: string; createdAt: string }[];

  openModifierModal: (product: any, existingItem?: any) => void;
  closeModifierModal: () => void;

  openPaymentModal: () => void;
  closePaymentModal: () => void;

  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  openNotifications: () => void;
  closeNotifications: () => void;

  setActiveCategory: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModifierModalOpen: false,
  isPaymentModalOpen: false,
  isSettingsModalOpen: false,
  isSearchOpen: false,
  isNotificationsOpen: false,
  activeCategoryId: null,
  modifierModalData: null,
  searchQuery: '',
  notifications: [],

  openModifierModal: (product, existingItem) =>
    set({ isModifierModalOpen: true, modifierModalData: { product, existingItem } }),
  closeModifierModal: () =>
    set({ isModifierModalOpen: false, modifierModalData: null }),

  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),

  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openNotifications: () => set({ isNotificationsOpen: true }),
  closeNotifications: () => set({ isNotificationsOpen: false }),

  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addNotification: (message) =>
    set((state) => ({
      notifications: [
        { id: crypto.randomUUID(), message, createdAt: new Date().toISOString() },
        ...state.notifications,
      ].slice(0, 20),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
