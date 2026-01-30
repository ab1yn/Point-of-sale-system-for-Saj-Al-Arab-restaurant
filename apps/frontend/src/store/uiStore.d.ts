interface UIState {
    isModifierModalOpen: boolean;
    isPaymentModalOpen: boolean;
    isSettingsModalOpen: boolean;
    isSearchOpen: boolean;
    isNotificationsOpen: boolean;
    activeCategoryId: number | null;
    modifierModalData: {
        product: any;
        existingItem?: any;
    } | null;
    searchQuery: string;
    notifications: {
        id: string;
        message: string;
        createdAt: string;
    }[];
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
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIState>>;
export {};
