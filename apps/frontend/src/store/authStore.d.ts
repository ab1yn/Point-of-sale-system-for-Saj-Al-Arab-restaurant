import type { User } from '@saj/types';
interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    initialize: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthState, {
            user: {
                id?: number;
                username?: string;
                name?: string;
                role?: "admin" | "manager" | "cashier";
                isActive?: boolean;
                createdAt?: string;
            };
            token: string;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthState) => void) => () => void;
        onFinishHydration: (fn: (state: AuthState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthState, {
            user: {
                id?: number;
                username?: string;
                name?: string;
                role?: "admin" | "manager" | "cashier";
                isActive?: boolean;
                createdAt?: string;
            };
            token: string;
        }>>;
    };
}>;
export {};
