import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Category, Product, User } from '@saj/types';

export const SettingsModal = () => {
  const { isSettingsModalOpen, closeSettingsModal } = useUIStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const canManageUsers = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('products');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<any>(null);

  const [categoryForm, setCategoryForm] = useState({
    id: undefined as number | undefined,
    name: '',
    nameAr: '',
    displayOrder: 0,
    isActive: true,
  });

  const [productForm, setProductForm] = useState({
    id: undefined as number | undefined,
    name: '',
    nameAr: '',
    price: 0,
    categoryId: 0,
    displayOrder: 0,
    isActive: true,
  });

  const [userForm, setUserForm] = useState({
    username: '',
    name: '',
    role: 'cashier',
    password: '',
  });

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id || 0, c.nameAr));
    return map;
  }, [categories]);

  const resetCategoryForm = () => {
    setCategoryForm({ id: undefined, name: '', nameAr: '', displayOrder: 0, isActive: true });
  };

  const resetProductForm = () => {
    setProductForm({ id: undefined, name: '', nameAr: '', price: 0, categoryId: 0, displayOrder: 0, isActive: true });
  };

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data || []);
  };

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data.data || []);
  };

  const fetchUsers = async () => {
    if (!canManageUsers) return;
    const res = await api.get('/users');
    setUsers(res.data.data || []);
  };

  const fetchReport = async () => {
    const res = await api.get('/reports/daily', { params: { date: reportDate } });
    setReport(res.data.data || null);
  };

  useEffect(() => {
    if (!isSettingsModalOpen) return;
    if (activeTab === 'products') {
      fetchCategories().catch(() => toast.error('فشل تحميل الأقسام'));
      fetchProducts().catch(() => toast.error('فشل تحميل المنتجات'));
    }
    if (activeTab === 'categories') {
      fetchCategories().catch(() => toast.error('فشل تحميل الأقسام'));
    }
    if (activeTab === 'users') {
      fetchUsers().catch(() => toast.error('فشل تحميل المستخدمين'));
    }
    if (activeTab === 'reports') {
      fetchReport().catch(() => toast.error('فشل تحميل التقرير'));
    }
  }, [isSettingsModalOpen, activeTab]);

  const saveCategory = async () => {
    try {
      const payload = {
        name: categoryForm.name.trim(),
        nameAr: categoryForm.nameAr.trim(),
        displayOrder: Number(categoryForm.displayOrder) || 0,
        isActive: categoryForm.isActive,
      };
      if (categoryForm.id) {
        await api.put(`/categories/${categoryForm.id}`, payload);
        toast.success('تم حفظ القسم');
      } else {
        await api.post('/categories', payload);
        toast.success('تم إضافة القسم');
      }
      resetCategoryForm();
      fetchCategories();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch {
      toast.error('تعذر حفظ القسم');
    }
  };

  const deleteCategory = async (id?: number) => {
    if (!id) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('تم حذف القسم');
      fetchCategories();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch {
      toast.error('تعذر حذف القسم');
    }
  };

  const saveProduct = async () => {
    try {
      const payload = {
        name: productForm.name.trim(),
        nameAr: productForm.nameAr.trim(),
        price: Number(productForm.price) || 0,
        categoryId: Number(productForm.categoryId) || 0,
        displayOrder: Number(productForm.displayOrder) || 0,
        isActive: productForm.isActive,
      };
      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, payload);
        toast.success('تم حفظ المنتج');
      } else {
        await api.post('/products', payload);
        toast.success('تم إضافة المنتج');
      }
      resetProductForm();
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch {
      toast.error('تعذر حفظ المنتج');
    }
  };

  const deleteProduct = async (id?: number) => {
    if (!id) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('تم حذف المنتج');
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch {
      toast.error('تعذر حذف المنتج');
    }
  };

  const saveUser = async () => {
    try {
      await api.post('/users', {
        username: userForm.username.trim(),
        name: userForm.name.trim(),
        role: userForm.role,
        password: userForm.password,
      });
      toast.success('تم إضافة المستخدم');
      setUserForm({ username: '', name: '', role: 'cashier', password: '' });
      fetchUsers();
    } catch {
      toast.error('تعذر إضافة المستخدم');
    }
  };

  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={closeSettingsModal}>
      <DialogContent className="max-w-5xl h-[640px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>الإعدادات</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-4' : 'grid-cols-3'} bg-slate-800 p-1 rounded-md`}>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الأقسام</TabsTrigger>
            {canManageUsers && <TabsTrigger value="users">المستخدمين</TabsTrigger>}
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>
          <div className="mt-4 h-[520px] border rounded-md border-slate-700 bg-slate-800">
            <ScrollArea className="h-full p-4">
              <TabsContent value="products" className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold">إضافة / تعديل منتج</h3>
                    <div className="grid gap-2">
                      <Label>الاسم</Label>
                      <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div className="grid gap-2">
                      <Label>الاسم بالعربي</Label>
                      <Input value={productForm.nameAr} onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div className="grid gap-2">
                      <Label>القسم</Label>
                      <select
                        className="h-10 rounded-md bg-slate-700 border border-slate-600 px-3"
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                      >
                        <option value={0}>اختر القسم</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.nameAr}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label>السعر</Label>
                        <Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} className="bg-slate-700 border-slate-600" />
                      </div>
                      <div className="grid gap-2">
                        <Label>الترتيب</Label>
                        <Input type="number" value={productForm.displayOrder} onChange={(e) => setProductForm({ ...productForm, displayOrder: Number(e.target.value) })} className="bg-slate-700 border-slate-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={productForm.isActive} onCheckedChange={(v) => setProductForm({ ...productForm, isActive: Boolean(v) })} />
                      <span>نشط</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={saveProduct}>حفظ</Button>
                      <Button variant="outline" onClick={resetProductForm}>مسح</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">قائمة المنتجات</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>المنتج</TableHead>
                          <TableHead>القسم</TableHead>
                          <TableHead>السعر</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>{p.nameAr}</TableCell>
                            <TableCell>{categoryMap.get(p.categoryId) || '-'}</TableCell>
                            <TableCell>{p.price}</TableCell>
                            <TableCell className="text-left">
                              <div className="flex gap-2 justify-start">
                                <Button size="sm" variant="outline" onClick={() => setProductForm({
                                  id: p.id,
                                  name: p.name,
                                  nameAr: p.nameAr,
                                  price: p.price,
                                  categoryId: p.categoryId,
                                  displayOrder: p.displayOrder || 0,
                                  isActive: Boolean(p.isActive),
                                })}>تعديل</Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteProduct(p.id)}>حذف</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold">إضافة / تعديل قسم</h3>
                    <div className="grid gap-2">
                      <Label>الاسم</Label>
                      <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div className="grid gap-2">
                      <Label>الاسم بالعربي</Label>
                      <Input value={categoryForm.nameAr} onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label>الترتيب</Label>
                        <Input type="number" value={categoryForm.displayOrder} onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })} className="bg-slate-700 border-slate-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={categoryForm.isActive} onCheckedChange={(v) => setCategoryForm({ ...categoryForm, isActive: Boolean(v) })} />
                      <span>نشط</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={saveCategory}>حفظ</Button>
                      <Button variant="outline" onClick={resetCategoryForm}>مسح</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">قائمة الأقسام</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>القسم</TableHead>
                          <TableHead>الترتيب</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell>{c.nameAr}</TableCell>
                            <TableCell>{c.displayOrder || 0}</TableCell>
                            <TableCell className="text-left">
                              <div className="flex gap-2 justify-start">
                                <Button size="sm" variant="outline" onClick={() => setCategoryForm({
                                  id: c.id,
                                  name: c.name,
                                  nameAr: c.nameAr,
                                  displayOrder: c.displayOrder || 0,
                                  isActive: Boolean(c.isActive),
                                })}>تعديل</Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteCategory(c.id)}>حذف</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {canManageUsers && (
                <TabsContent value="users" className="mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold">إضافة مستخدم</h3>
                      <div className="grid gap-2">
                        <Label>اسم المستخدم</Label>
                        <Input value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} className="bg-slate-700 border-slate-600" />
                      </div>
                      <div className="grid gap-2">
                        <Label>الاسم</Label>
                        <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="bg-slate-700 border-slate-600" />
                      </div>
                      <div className="grid gap-2">
                        <Label>الدور</Label>
                        <select
                          className="h-10 rounded-md bg-slate-700 border border-slate-600 px-3"
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                        >
                          <option value="admin">مدير</option>
                          <option value="manager">مشرف</option>
                          <option value="cashier">كاشير</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>كلمة المرور</Label>
                        <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="bg-slate-700 border-slate-600" />
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={saveUser}>إضافة</Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">المستخدمون</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الاسم</TableHead>
                            <TableHead>اسم المستخدم</TableHead>
                            <TableHead>الدور</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell>{u.name}</TableCell>
                              <TableCell>{u.username}</TableCell>
                              <TableCell>{u.role}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="reports" className="mt-0">
                <div className="grid gap-4">
                  <div className="flex items-end gap-3">
                    <div className="grid gap-2">
                      <Label>التاريخ</Label>
                      <Input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="bg-slate-700 border-slate-600" />
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={fetchReport}>عرض التقرير</Button>
                  </div>
                  {report && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-md bg-slate-900 border border-slate-700 p-4">
                        <div className="text-slate-400">إجمالي الطلبات</div>
                        <div className="text-2xl font-bold">{report.summary?.orderCount || 0}</div>
                      </div>
                      <div className="rounded-md bg-slate-900 border border-slate-700 p-4">
                        <div className="text-slate-400">إجمالي المبيعات</div>
                        <div className="text-2xl font-bold">{report.summary?.totalSales || 0}</div>
                      </div>
                      <div className="rounded-md bg-slate-900 border border-slate-700 p-4">
                        <div className="text-slate-400">كاش / بطاقة</div>
                        <div className="text-2xl font-bold">{report.summary?.totalCash || 0} / {report.summary?.totalCard || 0}</div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
