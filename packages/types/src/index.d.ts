import { z } from 'zod';
export declare const OrderType: z.ZodEnum<["takeaway", "delivery", "dinein"]>;
export declare const OrderStatus: z.ZodEnum<["draft", "kitchen", "completed", "cancelled"]>;
export declare const ModifierType: z.ZodEnum<["addon", "option"]>;
export declare const PaymentMethod: z.ZodEnum<["cash", "card", "split"]>;
export declare const UserRole: z.ZodEnum<["admin", "manager", "cashier"]>;
export declare const CategorySchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    nameAr: z.ZodString;
    displayOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodNumber]>, boolean, number | boolean>>;
}, "strip", z.ZodTypeAny, {
    id?: number;
    name?: string;
    isActive?: boolean;
    nameAr?: string;
    displayOrder?: number;
}, {
    id?: number;
    name?: string;
    isActive?: number | boolean;
    nameAr?: string;
    displayOrder?: number;
}>;
export declare const ModifierSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    nameAr: z.ZodString;
    price: z.ZodNumber;
    type: z.ZodDefault<z.ZodEnum<["addon", "option"]>>;
}, "strip", z.ZodTypeAny, {
    id?: number;
    name?: string;
    type?: "option" | "addon";
    nameAr?: string;
    price?: number;
}, {
    id?: number;
    name?: string;
    type?: "option" | "addon";
    nameAr?: string;
    price?: number;
}>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodNumber;
    name: z.ZodString;
    nameAr: z.ZodString;
    price: z.ZodNumber;
    displayOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodNumber]>, boolean, number | boolean>>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        nameAr: z.ZodString;
        price: z.ZodNumber;
        type: z.ZodDefault<z.ZodEnum<["addon", "option"]>>;
    }, "strip", z.ZodTypeAny, {
        id?: number;
        name?: string;
        type?: "option" | "addon";
        nameAr?: string;
        price?: number;
    }, {
        id?: number;
        name?: string;
        type?: "option" | "addon";
        nameAr?: string;
        price?: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
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
}, {
    id?: number;
    name?: string;
    isActive?: number | boolean;
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
}>;
export declare const OrderItemModifierSchema: z.ZodObject<{
    modifierId: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price?: number;
    modifierId?: number;
}, {
    price?: number;
    modifierId?: number;
}>;
export declare const OrderItemSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    productId: z.ZodNumber;
    productName: z.ZodOptional<z.ZodString>;
    productNameAr: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    modifiers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        modifierId: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price?: number;
        modifierId?: number;
    }, {
        price?: number;
        modifierId?: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    orderNumber: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["takeaway", "delivery", "dinein"]>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "kitchen", "completed", "cancelled"]>>;
    tableNumber: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    customerPhone: z.ZodOptional<z.ZodString>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    deliveryFee: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        productId: z.ZodNumber;
        productName: z.ZodOptional<z.ZodString>;
        productNameAr: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
        modifiers: z.ZodDefault<z.ZodArray<z.ZodObject<{
            modifierId: z.ZodNumber;
            price: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            price?: number;
            modifierId?: number;
        }, {
            price?: number;
            modifierId?: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>, "many">>;
    subtotal: z.ZodDefault<z.ZodNumber>;
    discount: z.ZodDefault<z.ZodNumber>;
    total: z.ZodDefault<z.ZodNumber>;
    paidAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sentToKitchenAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export declare const PaymentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    orderId: z.ZodNumber;
    method: z.ZodEnum<["cash", "card", "split"]>;
    cashAmount: z.ZodDefault<z.ZodNumber>;
    cardAmount: z.ZodDefault<z.ZodNumber>;
    total: z.ZodNumber;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: number;
    createdAt?: string;
    method?: "split" | "cash" | "card";
    total?: number;
    orderId?: number;
    cashAmount?: number;
    cardAmount?: number;
}, {
    id?: number;
    createdAt?: string;
    method?: "split" | "cash" | "card";
    total?: number;
    orderId?: number;
    cashAmount?: number;
    cardAmount?: number;
}>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    username: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["admin", "manager", "cashier"]>;
    isActive: z.ZodDefault<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodNumber]>, boolean, number | boolean>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: number;
    username?: string;
    name?: string;
    role?: "admin" | "manager" | "cashier";
    isActive?: boolean;
    createdAt?: string;
}, {
    id?: number;
    username?: string;
    name?: string;
    role?: "admin" | "manager" | "cashier";
    isActive?: number | boolean;
    createdAt?: string;
}>;
export type Category = z.infer<typeof CategorySchema>;
export type Modifier = z.infer<typeof ModifierSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderItemModifier = z.infer<typeof OrderItemModifierSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRole>;
export type OrderType = z.infer<typeof OrderType>;
export type OrderStatus = z.infer<typeof OrderStatus>;
export type ModifierType = z.infer<typeof ModifierType>;
export type PaymentMethod = z.infer<typeof PaymentMethod>;
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
