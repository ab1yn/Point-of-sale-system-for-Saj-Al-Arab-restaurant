import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Modifier, OrderType } from '@saj/types';
import { v4 as uuidv4 } from 'uuid';

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
  discount: { type: 'percent' | 'fixed'; value: number } | null;
  orderNotes: string;
  orderMeta: {
    tableNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryFee: number;
  };

  // Actions
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

  // Getters (Computed manually in components or via get())
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'takeaway',
      discount: null,
      orderNotes: '',
      orderMeta: {
        tableNumber: '',
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryFee: 0,
      },

      addItem: (product, modifiers = [], notes = '', quantity = 1) => {
        const { items } = get();
        // Check for identical item
        const existing = items.find(
          (item) =>
            item.product.id === product.id &&
            item.notes === notes &&
            JSON.stringify(item.selectedModifiers.map(m => m.id).sort()) ===
            JSON.stringify(modifiers.map(m => m.id).sort())
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i.cartItemId === existing.cartItemId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                cartItemId: uuidv4(), // Client-side UUID using uuid module? No, I need to add uuid to package.json or use crypto.randomUUID
                product,
                quantity,
                selectedModifiers: modifiers,
                notes,
              },
            ],
          });
        }
      },

      updateItem: (cartItemId, updates) => {
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, ...updates } : i
          ),
        });
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
      },

      incQty: (cartItemId) => {
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      },

      decQty: (cartItemId) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (item && item.quantity > 1) {
          set({
            items: get().items.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },

      clearCart: () =>
        set({
          items: [],
          discount: null,
          orderNotes: '',
          orderMeta: {
            tableNumber: '',
            customerName: '',
            customerPhone: '',
            deliveryAddress: '',
            deliveryFee: 0,
          },
        }), // notes:'' isn't in state root but useful reset

      setOrderType: (type) =>
        set((state) => {
          if (type === 'dinein') {
            return {
              orderType: type,
              orderMeta: {
                tableNumber: state.orderMeta.tableNumber,
                customerName: '',
                customerPhone: '',
                deliveryAddress: '',
                deliveryFee: 0,
              },
            };
          }
          if (type === 'delivery') {
            return {
              orderType: type,
              orderMeta: {
                tableNumber: '',
                customerName: state.orderMeta.customerName,
                customerPhone: state.orderMeta.customerPhone,
                deliveryAddress: state.orderMeta.deliveryAddress,
                deliveryFee: state.orderMeta.deliveryFee || 0,
              },
            };
          }
          return {
            orderType: type,
            orderMeta: {
              tableNumber: '',
              customerName: '',
              customerPhone: '',
              deliveryAddress: '',
              deliveryFee: 0,
            },
          };
        }),

      setOrderMeta: (updates) =>
        set((state) => ({
          orderMeta: { ...state.orderMeta, ...updates },
        })),

      setOrderNotes: (notes) => set({ orderNotes: notes }),

      setDiscount: (type, value) => set({ discount: { type, value } }),

      removeDiscount: () => set({ discount: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const itemPrice = item.product.price;
          const modsPrice = item.selectedModifiers.reduce((s, m) => s + m.price, 0);
          return sum + (itemPrice + modsPrice) * item.quantity;
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const { discount } = get();
        const deliveryFee = get().orderType === 'delivery' ? get().orderMeta.deliveryFee || 0 : 0;
        if (!discount) return Math.round((subtotal + deliveryFee) * 100) / 100;

        let final = subtotal;
        if (discount.type === 'fixed') {
          final = Math.max(0, subtotal - discount.value);
        } else {
          final = Math.max(0, subtotal * (1 - discount.value / 100));
        }
        final += deliveryFee;
        return Math.round(final * 100) / 100; // Round to 2 decimals
      },
    }),
    {
      name: 'saj-pos-cart',
      // skipHydration: true? No, we want persistence.
    }
  )
);
