import { useCategories } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx } from 'clsx';
import { useUIStore } from '@/store/uiStore';
import { Spinner } from '@/components/ui/spinner';

const CATEGORY_COLORS: Record<string, string> = {
  'Shawarma': 'border-purple-500 text-purple-400 hover:bg-purple-900/20 data-[state=active]:bg-purple-500 data-[state=active]:text-white',
  'Manakeesh': 'border-blue-500 text-blue-400 hover:bg-blue-900/20 data-[state=active]:bg-blue-500 data-[state=active]:text-white',
  'Falafel': 'border-green-500 text-green-400 hover:bg-green-900/20 data-[state=active]:bg-green-500 data-[state=active]:text-white',
  'Appetizers': 'border-amber-500 text-amber-400 hover:bg-amber-900/20 data-[state=active]:bg-amber-500 data-[state=active]:text-white',
  'Beverages': 'border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 data-[state=active]:bg-cyan-500 data-[state=active]:text-white',
};

export const CategoryPanel = () => {
  const { data: categories, isLoading } = useCategories();
  const { activeCategoryId, setActiveCategory } = useUIStore();

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-slate-800 border-l border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-slate-100 mb-2">الأقسام</h2>
        <Button
          variant="outline"
          className={clsx(
            "w-full justify-start h-12 text-lg font-bold border-2 transition-all duration-200 ease-out will-change-transform hover:scale-[1.02]",
            activeCategoryId === null
              ? "bg-slate-100 text-slate-900 border-slate-100"
              : "border-slate-600 text-slate-400 hover:bg-slate-700"
          )}
          onClick={() => setActiveCategory(null)}
        >
          الكل
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="grid gap-3 pt-4">
          {categories?.map((category) => {
            const colorClass = CATEGORY_COLORS[category.name] || 'border-slate-500 text-slate-400';

            return (
              <Button
                key={category.id}
                variant="outline"
                data-state={activeCategoryId === category.id ? 'active' : 'inactive'}
                className={clsx(
                  "w-full h-20 text-xl font-bold border-2 justify-start px-6 transition-all duration-200 ease-out will-change-transform hover:scale-[1.02]",
                  colorClass
                )}
                onClick={() => setActiveCategory(category.id!)}
              >
                {category.nameAr}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
