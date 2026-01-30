import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useCreateOrder, useSendToKitchen } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { Trash2, Minus, Plus, Utensils, ShoppingBag, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { printKitchenTicket } from '../printing/PrintTemplates';

export const OrderPanel = () => {
  const {
    items,
    orderType,
    setOrderType,
    removeItem,
    incQty,
    decQty,
    getSubtotal,
    getTotal,
    discount,
    clearCart,
    orderMeta,
    setOrderMeta,
    orderNotes,
    setOrderNotes,
    setDiscount,
    removeDiscount,
  } = useCartStore();

  const { openModifierModal, openPaymentModal, addNotification } = useUIStore();
  const subtotal = getSubtotal();
  const total = getTotal();

  const createOrder = useCreateOrder();
  const sendToKitchen = useSendToKitchen();

  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>(discount?.type || 'percent');
  const [discountValue, setDiscountValue] = useState<string>(discount ? String(discount.value) : '');
  const [notesDraft, setNotesDraft] = useState<string>(orderNotes || '');

  const validateOrderMeta = () => {
    if (orderType === 'dinein' && !orderMeta.tableNumber.trim()) {
      toast.error('رقم الطاولة مطلوب للطلبات المحلية');
      return false;
    }
    if (orderType === 'delivery') {
      if (!orderMeta.customerName.trim()) {
        toast.error('اسم العميل مطلوب للتوصيل');
        return false;
      }
      if (!orderMeta.customerPhone.trim()) {
        toast.error('رقم الهاتف مطلوب للتوصيل');
        return false;
      }
    }
    return true;
  };

  const openDiscount = () => {
    setDiscountType(discount?.type || 'percent');
    setDiscountValue(discount ? String(discount.value) : '');
    setIsDiscountOpen(true);
  };

  const applyDiscount = () => {
    const value = Number(discountValue);
    if (!value || value <= 0) {
      removeDiscount();
      setIsDiscountOpen(false);
      return;
    }
    if (discountType === 'percent' && value > 100) {
      toast.error('نسبة الخصم يجب ألا تتجاوز 100');
      return;
    }
    setDiscount(discountType, value);
    setIsDiscountOpen(false);
  };

  const openNotes = () => {
    setNotesDraft(orderNotes || '');
    setIsNotesOpen(true);
  };

  const saveNotes = () => {
    setOrderNotes(notesDraft.trim());
    setIsNotesOpen(false);
  };

  const handleKitchenPrint = async () => {
    if (items.length === 0) {
      toast.error('الطلب فارغ');
      return;
    }
    if (!validateOrderMeta()) return;

    try {
      const orderRes = await createOrder.mutateAsync({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          notes: i.notes,
          modifiers: i.selectedModifiers.map((m) => ({ modifierId: m.id, price: m.price })),
        })),
        type: orderType,
        status: 'kitchen',
        subtotal: subtotal,
        total: total,
        tableNumber: orderMeta.tableNumber || undefined,
        customerName: orderMeta.customerName || undefined,
        customerPhone: orderMeta.customerPhone || undefined,
        deliveryAddress: orderMeta.deliveryAddress || undefined,
        deliveryFee: orderMeta.deliveryFee || 0,
        notes: orderNotes || undefined,
      } as any);

      const finalOrder = await sendToKitchen.mutateAsync(orderRes.id);

      printKitchenTicket(
        finalOrder.orderNumber!,
        finalOrder.type,
        items,
        orderNotes,
        finalOrder
      );

      toast.success(`تم إرسال الطلب للمطبخ (#${finalOrder.orderNumber})`);(`تم إرسال الطلب للمطبخ (#${finalOrder.orderNumber})`);
    } catch (e) {
      toast.error('فشل إرسال الطلب للمطبخ');
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      <div className="p-4 bg-slate-800 border-b border-slate-700 space-y-3">
        <h2 className="text-xl font-bold text-white">الطلب الحالي</h2>
        <Tabs value={orderType} onValueChange={(v: any) => setOrderType(v)} className="w-full">
          <TabsList className="!grid w-full grid-cols-3 gap-1 rounded-full bg-slate-700/60 p-0 h-11">
            <TabsTrigger
              value="dinein"
              className="h-11 w-full justify-center flex-row-reverse gap-2 rounded-full px-4 text-base text-slate-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Utensils className="h-4 w-4" />
              محلي
            </TabsTrigger>
            <TabsTrigger
              value="takeaway"
              className="h-11 w-full justify-center flex-row-reverse gap-2 rounded-full px-4 text-base text-slate-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              سفري
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="h-11 w-full justify-center flex-row-reverse gap-2 rounded-full px-4 text-base text-slate-200 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Truck className="h-4 w-4" />
              توصيل
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-3 grid gap-3 border-t border-slate-700 pt-3">
          {orderType === 'dinein' && (
            <div className="grid gap-2">
              <Label className="text-sm text-slate-300">رقم الطاولة</Label>
              <Input
                value={orderMeta.tableNumber}
                onChange={(e) => setOrderMeta({ tableNumber: e.target.value })}
                className="h-11 bg-slate-700 border-slate-600 text-white"
                placeholder="مثال: طاولة 1"
              />
            </div>
          )}
          {orderType === 'delivery' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 text-sm font-semibold text-slate-200">بيانات التوصيل</div>
              <div className="col-span-1 grid gap-2">
                <Label className="text-sm text-slate-300">اسم العميل</Label>
                <Input
                  value={orderMeta.customerName}
                  onChange={(e) => setOrderMeta({ customerName: e.target.value })}
                  className="h-11 bg-slate-700 border-slate-600 text-white"
                  placeholder="اسم العميل"
                />
              </div>
              <div className="col-span-1 grid gap-2">
                <Label className="text-sm text-slate-300">رقم الهاتف</Label>
                <Input
                  value={orderMeta.customerPhone}
                  onChange={(e) => setOrderMeta({ customerPhone: e.target.value })}
                  className="h-11 bg-slate-700 border-slate-600 text-white"
                  placeholder="07xxxxxxxx"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 p-3">
        {items.length === 0 ? (
          <div className="text-slate-500 text-center mt-20">لا يوجد عناصر في الطلب</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.cartItemId} className="bg-slate-800 rounded-lg p-3 border border-slate-700 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-100">{item.product.nameAr}</h3>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-red-500 p-1 hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {(item.selectedModifiers.length > 0 || item.notes) && (
                  <div className="text-sm text-slate-400 mb-3 pr-2 border-r-2 border-slate-600">
                    {item.selectedModifiers.map((mod) => (
                      <div key={mod.id} className="flex justify-between">
                        <span>- {mod.nameAr}</span>
                        <span className="text-slate-500">{mod.price > 0 ? formatPrice(mod.price) : ''}</span>
                      </div>
                    ))}
                    {item.notes && <div className="italic mt-1 text-amber-500">ملاحظة: {item.notes}</div>}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-slate-900 rounded-md px-2 py-1">
                    <button onClick={() => decQty(item.cartItemId)} className="p-1 text-slate-300 hover:text-white">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold w-6 text-center text-white">{item.quantity}</span>
                    <button onClick={() => incQty(item.cartItemId)} className="p-1 text-slate-300 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModifierModal(item.product, item)}
                      className="text-xs text-blue-400 underline hover:text-blue-300"
                    >
                      تعديل
                    </button>
                    <span className="font-bold text-emerald-400 text-lg">
                      {formatPrice(
                        (item.product.price + item.selectedModifiers.reduce((a, b) => a + b.price, 0)) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="bg-slate-800 border-t border-slate-700 p-4 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-amber-500">
              <span>خصم ({discount.type === 'percent' ? `%${discount.value}` : formatPrice(discount.value)})</span>
              <span>-{formatPrice(subtotal - total)}</span>
            </div>
          )}
          {orderType === 'delivery' && orderMeta.deliveryFee > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>رسوم التوصيل</span>
              <span>{formatPrice(orderMeta.deliveryFee)}</span>
            </div>
          )}
          <Separator className="bg-slate-600" />
          <div className="flex justify-between text-2xl font-bold text-white">
            <span>الإجمالي</span>
            <span className="text-emerald-400">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={openDiscount} className="h-14 flex-col gap-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:text-white">
            خصم
          </Button>
          <Button variant="outline" onClick={openNotes} className="h-14 flex-col gap-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:text-white">
            ملاحظات
          </Button>
          <Button className="col-span-1 h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold" onClick={handleKitchenPrint}>
            إرسال للمطبخ
          </Button>
          <Button
            className="col-span-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg"
            onClick={openPaymentModal}
            disabled={items.length === 0}
          >
            الدفع
          </Button>
        </div>

        <Dialog open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
          <DialogContent className="bg-slate-800 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>الخصم</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={discountType === 'percent' ? 'default' : 'outline'}
                  className={discountType === 'percent' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                  onClick={() => setDiscountType('percent')}
                >
                  نسبة %
                </Button>
                <Button
                  type="button"
                  variant={discountType === 'fixed' ? 'default' : 'outline'}
                  className={discountType === 'fixed' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                  onClick={() => setDiscountType('fixed')}
                >
                  قيمة ثابتة
                </Button>
              </div>
              <div className="grid gap-2">
                <Label>قيمة الخصم</Label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="h-11 bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDiscountOpen(false)}>إلغاء</Button>
              <Button onClick={applyDiscount} className="bg-emerald-600 hover:bg-emerald-500">تطبيق</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
          <DialogContent className="bg-slate-800 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>ملاحظات الطلب</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              <Label>ملاحظات</Label>
              <Textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                placeholder="اكتب ملاحظات الطلب..."
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsNotesOpen(false)}>إلغاء</Button>
              <Button onClick={saveNotes} className="bg-emerald-600 hover:bg-emerald-500">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


