import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { Category, Product, Order, Modifier } from '@saj/types';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>('/categories?active=true');
      return data.data;
    },
  });
};

// Products
export const useProducts = (categoryId?: number | null) => {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const params = categoryId ? { categoryId, active: true } : { active: true };
      const { data } = await api.get<{ data: Product[] }>('/products', { params });
      return data.data;
    },
  });
};

// Modifiers
export const useModifiers = () => {
  return useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Modifier[] }>('/modifiers');
      return data.data;
    },
  });
};

// Orders
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const { data } = await api.post<{ data: Order }>('/orders', orderData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useSendToKitchen = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.post<{ data: Order }>(`/orders/${orderId}/send-kitchen`);
      return data.data;
    },
  });
};

export const useProcessPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: any) => {
      const { data } = await api.post('/payments', paymentData);
      return data.data;
    },
  });
};
