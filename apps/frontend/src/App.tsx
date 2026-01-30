import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      {user ? <MainLayout /> : <LoginScreen />}
      <Toaster position="top-center" richColors theme="dark" />
    </QueryClientProvider>
  )
}

export default App
