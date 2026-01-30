import { useProducts } from '@/lib/hooks';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export const ProductGrid = () => {
  const { activeCategoryId, openModifierModal, searchQuery } = useUIStore();
  const { data: products, isLoading } = useProducts(searchQuery ? null : activeCategoryId);
  const addItem = useCartStore((state) => state.addItem);

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = products?.filter((product) => {
    if (!query) return true;
    const name = (product.name || '').toLowerCase();
    const nameAr = (product.nameAr || '').toLowerCase();
    return name.includes(query) || nameAr.includes(query);
  });

  const handleProductClick = (product: any) => {
    if (product.modifiers && product.modifiers.length > 0) {
      openModifierModal(product);
    } else {
      addItem(product);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-white text-lg font-bold">
          {query ? `نتائج البحث: ${searchQuery}` : activeCategoryId ? 'المنتجات' : 'كل المنتجات'}
          <span className="text-slate-500 text-sm mr-2">({filteredProducts?.length || 0})</span>
        </h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-4 pb-20">
          {filteredProducts?.map((product) => (
            <Card
              key={product.id}
              className="
                  cursor-pointer 
                  hover:scale-[1.02] active:scale-[0.98] 
                  transition-all duration-200 ease-out
                  border-slate-700 bg-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20
                  flex flex-col justify-between
                  min-h-[140px] p-4
                  will-change-transform
                "
              onClick={() => handleProductClick(product)}
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-50 leading-tight">
                  {product.nameAr}
                </h3>
              </div>

              <div className="mt-4 flex justify-end">
                <span className="text-emerald-400 font-bold text-2xl" dir="ltr">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
