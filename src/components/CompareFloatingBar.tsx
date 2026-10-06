import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface CompareFloatingBarProps {
  products: Product[];
  onOpenCompare: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  products,
  onOpenCompare,
  onClear,
  onRemove,
}) => {
  if (products.length === 0) return null;

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-4 max-w-xl w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs font-semibold whitespace-nowrap">
          Compare ({products.length}/3):
        </span>
      </div>

      {/* Mini Thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg text-xs"
          >
            <span className="truncate max-w-28 text-[11px] font-medium">{p.name}</span>
            <button
              onClick={() => onRemove(p.id)}
              className="text-neutral-400 hover:text-white"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={onOpenCompare}
          className="px-3.5 py-1.5 bg-white text-neutral-950 font-bold rounded-lg text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClear}
          className="text-neutral-400 hover:text-white text-xs p-1"
          title="Clear all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
