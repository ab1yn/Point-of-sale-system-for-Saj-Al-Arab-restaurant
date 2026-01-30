import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const LoginScreen = () => {
  const { login, loading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    try {
      await login(username, password);
      toast.success('تم تسجيل الدخول');
    } catch {
      toast.error('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6" dir="rtl">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
        <p className="text-slate-400 mb-6">يرجى إدخال بياناتك للمتابعة</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">اسم المستخدم</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">كلمة المرور</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500" disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول'}
          </Button>
        </div>
      </form>
    </div>
  );
};
