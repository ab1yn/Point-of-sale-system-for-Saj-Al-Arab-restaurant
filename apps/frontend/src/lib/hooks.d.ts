export declare const useCategories: () => import("@tanstack/react-query").UseQueryResult<{
    id?: number;
    name?: string;
    isActive?: boolean;
    nameAr?: string;
    displayOrder?: number;
}[], Error>;
export declare const useProducts: (categoryId?: number | null) => import("@tanstack/react-query").UseQueryResult<{
    id?: number;
    name?: string;
    isActive?: boolean;
    nameAr?: string;
    displayOrder?: number;
    categoryId?: number;
    price?: number;
    modifiers?: {
        id?: number;
        name?: string;
        type?: "option" | "addon";
        nameAr?: string;
        price?: number;
    }[];
}[], Error>;
export declare const useModifiers: () => import("@tanstack/react-query").UseQueryResult<{
    id?: number;
    name?: string;
    type?: "option" | "addon";
    nameAr?: string;
    price?: number;
}[], Error>;
export declare const useCreateOrder: () => import("@tanstack/react-query").UseMutationResult<{
    id?: number;
    type?: "takeaway" | "delivery" | "dinein";
    status?: "draft" | "kitchen" | "completed" | "cancelled";
    createdAt?: string;
    items?: {
        id?: number;
        price?: number;
        modifiers?: {
            price?: number;
            modifierId?: number;
        }[];
        notes?: string;
        quantity?: number;
        productId?: number;
        productName?: string;
        productNameAr?: string;
    }[];
    discount?: number;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    deliveryFee?: number;
    notes?: string;
    orderNumber?: string;
    subtotal?: number;
    total?: number;
    paidAt?: string;
    sentToKitchenAt?: string;
}, Error, Partial<{
    id?: number;
    type?: "takeaway" | "delivery" | "dinein";
    status?: "draft" | "kitchen" | "completed" | "cancelled";
    createdAt?: string;
    items?: {
        id?: number;
        price?: number;
        modifiers?: {
            price?: number;
            modifierId?: number;
        }[];
        notes?: string;
        quantity?: number;
        productId?: number;
        productName?: string;
        productNameAr?: string;
    }[];
    discount?: number;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    deliveryFee?: number;
    notes?: string;
    orderNumber?: string;
    subtotal?: number;
    total?: number;
    paidAt?: string;
    sentToKitchenAt?: string;
}>, unknown>;
export declare const useSendToKitchen: () => import("@tanstack/react-query").UseMutationResult<{
    id?: number;
    type?: "takeaway" | "delivery" | "dinein";
    status?: "draft" | "kitchen" | "completed" | "cancelled";
    createdAt?: string;
    items?: {
        id?: number;
        price?: number;
        modifiers?: {
            price?: number;
            modifierId?: number;
        }[];
        notes?: string;
        quantity?: number;
        productId?: number;
        productName?: string;
        productNameAr?: string;
    }[];
    discount?: number;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    deliveryFee?: number;
    notes?: string;
    orderNumber?: string;
    subtotal?: number;
    total?: number;
    paidAt?: string;
    sentToKitchenAt?: string;
}, Error, number, unknown>;
export declare const useProcessPayment: () => import("@tanstack/react-query").UseMutationResult<any, Error, any, unknown>;
