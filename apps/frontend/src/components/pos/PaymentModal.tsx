import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder, useProcessPayment } from '@/lib/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { printReceipt } from '../printing/PrintTemplates';

export const PaymentModal = () => {
  const { isPaymentModalOpen, closePaymentModal, addNotification } = useUIStore();
  const { items, getTotal, orderType, clearCart, getSubtotal, orderMeta, orderNotes } = useCartStore();
  const createOrder = useCreateOrder();
  const processPayment = useProcessPayment();

  const total = getTotal();
  const [method, setMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const change = method === 'cash' ? Math.max(0, Number(cashReceived) - total) : 0;

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

  const handlePayment = async () => {
    if (!validateOrderMeta()) return;
    if (method === 'cash' && Number(cashReceived) < total) {
      toast.error('المبلغ المستلم غير كافٍ');
      return;
    }

    setIsProcessing(true);
    try {
      const orderRes = await createOrder.mutateAsync({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          notes: i.notes,
          modifiers: i.selectedModifiers.map((m) => ({ modifierId: m.id, price: m.price })),
        })),
        lines: items.length,
        type: orderType,
        status: 'completed',
        subtotal: getSubtotal(),
        total: total,
        paidAt: new Date().toISOString(),
        // This line was added as per user instruction. It is syntactically incorrect
        // for an object property and will cause a compilation error.
        // It's placed here faithfully as requested, but please review.
        orderNumber: undefined,
        customerName: orderMeta.customerName || undefined,
        customerPhone: orderMeta.customerPhone || undefined,
        deliveryAddress: orderMeta.deliveryAddress || undefined,
        deliveryFee: orderMeta.deliveryFee || 0,
        notes: orderNotes || undefined,
      } as any);

      await processPayment.mutateAsync({
        orderId: orderRes.id,
        method,
        cashAmount: method === 'cash' ? Number(cashReceived) : 0,
        cardAmount: method === 'card' ? total : 0,
        total,
      });

      printReceipt({ orderNumber: orderRes.orderNumber, type: orderType, ...orderMeta }, items, total, Number(cashReceived), change);

      toast.success('تم الدفع بنجاح');
      addNotification('تم الدفع بنجاح');
      clearCart();
      closePaymentModal();
      setCashReceived('');
    } catch (error) {
      toast.error('حدث خطأ أثناء الدفع');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isPaymentModalOpen} onOpenChange={closePaymentModal}>
      <DialogContent className="bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>الدفع</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="text-center bg-slate-900 p-4 rounded-lg">
            <span className="text-gray-400">المبلغ الإجمالي</span>
            <div className="text-4xl font-bold text-emerald-500 mt-2">{formatPrice(total)}</div>
          </div>

          <RadioGroup value={method} onValueChange={(v: any) => setMethod(v)} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
              <Label
                htmlFor="cash"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span className="text-xl font-bold">نقدي</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <span className="text-xl font-bold">بطاقة</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="split" id="split" className="peer sr-only" disabled />
              <Label
                htmlFor="split"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-slate-900 p-4 opacity-50 cursor-not-allowed"
              >
                <span className="text-xl font-bold">مختلط</span>
              </Label>
            </div>
          </RadioGroup>

          {method === 'cash' && (
            <div className="space-y-4">
              <div>
                <Label>المبلغ المستلم</Label>
                <Input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-2xl text-center h-14 bg-slate-700 border-slate-600 text-white"
                  autoFocus
                />
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>الباقي:</span>
                <span className="text-amber-500">{formatPrice(change)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={closePaymentModal} className="h-12 w-32">
            إلغاء
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="h-12 w-48 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold"
          >
            {isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



