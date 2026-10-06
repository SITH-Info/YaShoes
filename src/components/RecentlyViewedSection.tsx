import React from 'react';
import { History, Eye } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface RecentlyViewedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  currency: CurrencyConfig;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  products,
  onSelectProduct,
  currency,
}) => {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-neutral-200">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-4 h-4 text-neutral-500" />
        <h3 className="text-lg font-bold font-display text-neutral-950">
          Recently Viewed Footwear
        </h3>
        <span className="text-xs text-neutral-400 font-mono">({products.length})</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="group cursor-pointer bg-white rounded-xl border border-neutral-200/80 p-3 hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="aspect-4/3 bg-[#F9F9F8] rounded-lg p-2 flex items-center justify-center mb-2">
              <ShoeVisual
                colorway={p.colorways[0]}
                category={p.category}
                interactiveHover
                className="w-full h-18"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-neutral-700">
                {p.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="font-mono text-xs font-bold text-neutral-950">
                  {formatPrice(p.price, currency)}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  {p.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
