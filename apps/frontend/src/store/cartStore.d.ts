import { Product, Modifier, OrderType } from '@saj/types';
export interface CartItem {
    cartItemId: string;
    product: Product;
    quantity: number;
    selectedModifiers: Modifier[];
    notes: string;
}
interface CartState {
    items: CartItem[];
    orderType: OrderType;
    discount: {
        type: 'percent' | 'fixed';
        value: number;
    } | null;
    orderNotes: string;
    orderMeta: {
        tableNumber: string;
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        deliveryFee: number;
    };
    addItem: (product: Product, modifiers?: Modifier[], notes?: string, quantity?: number) => void;
    updateItem: (cartItemId: string, updates: Partial<CartItem>) => void;
    removeItem: (cartItemId: string) => void;
    incQty: (cartItemId: string) => void;
    decQty: (cartItemId: string) => void;
    clearCart: () => void;
    setOrderType: (type: OrderType) => void;
    setOrderMeta: (updates: Partial<CartState['orderMeta']>) => void;
    setOrderNotes: (notes: string) => void;
    setDiscount: (type: 'percent' | 'fixed', value: number) => void;
    removeDiscount: () => void;
    getSubtotal: () => number;
    getTotal: () => number;
}
export declare const useCartStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CartState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CartState, CartState>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CartState) => void) => () => void;
        onFinishHydration: (fn: (state: CartState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CartState, CartState>>;
    };
}>;
export {};
