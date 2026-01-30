import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

export const TopBar = () => {
  const { openSettingsModal } = useUIStore();
  const {
    isSearchOpen,
    openSearch,
    closeSearch,
    searchQuery,
    setSearchQuery,
    isNotificationsOpen,
    openNotifications,
    closeNotifications,
    notifications,
    clearNotifications,
  } = useUIStore();
  const { user, logout } = useAuthStore();
  const canOpenSettings = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 sticky top-0 z-10 text-slate-50">
      <div className="flex items-center gap-4 w-[30%]">
        <h1 className="text-xl font-bold text-white">صاج العرب POS</h1>
      </div>

      <div className="flex flex-col items-center justify-center w-[20%]">
        <span className="text-sm font-semibold text-emerald-400">نظام الكاشير</span>
        <span className="text-xs text-slate-400">{new Date().toLocaleDateString('ar-JO')}</span>
      </div>

      <div className="flex items-center justify-end gap-3 w-[50%]">
        {user && (
          <div className="text-right">
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-slate-400">{user.role}</div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={openSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-700 hover:text-white relative"
          onClick={openNotifications}
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute top-1 right-1 h-2 w-2 p-0 bg-red-500 rounded-full" />
          )}
        </Button>
        {canOpenSettings && (
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:bg-slate-700 hover:text-white"
            onClick={openSettingsModal}
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" className="text-slate-300 hover:bg-slate-700 hover:text-white" onClick={logout}>
          خروج
        </Button>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={(open) => (open ? openSearch() : closeSearch())}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>بحث المنتجات</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 bg-slate-700 border-slate-600 text-white"
              placeholder="ابحث باسم المنتج..."
              autoFocus
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSearchQuery('')}>مسح</Button>
            <Button onClick={closeSearch} className="bg-emerald-600 hover:bg-emerald-500">إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotificationsOpen} onOpenChange={(open) => (open ? openNotifications() : closeNotifications())}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>الإشعارات</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <div className="text-slate-400 text-center">لا توجد إشعارات</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2">
                  <div className="text-sm text-slate-200">{n.message}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(n.createdAt).toLocaleString('ar-JO')}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={clearNotifications}>مسح الكل</Button>
            <Button onClick={closeNotifications} className="bg-emerald-600 hover:bg-emerald-500">إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
