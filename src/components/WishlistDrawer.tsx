import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: CurrencyConfig;
  onRemoveWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product, size: number, colorIndex: number) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onRemoveWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h2 className="text-lg font-bold font-display text-neutral-950">
              Saved Sheos ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
              <Heart className="w-12 h-12 stroke-1 mb-3 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-700 font-display">No saved pairs yet</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Click the heart on any shoe to save it to your curated wishlist for later.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Browse Sheos
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const convertedPrice = Math.round(product.price * currency.rate);
              return (
                <div key={product.id} className="py-4 flex gap-4">
                  <div
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="w-20 h-20 bg-[#F9F9F8] rounded-xl border border-neutral-200 shrink-0 flex items-center justify-center p-1 cursor-pointer hover:border-neutral-400 transition-colors"
                  >
                    <ShoeVisual
                      colorway={product.colorways[product.defaultColorIndex || 0]}
                      category={product.category}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                          className="text-xs font-bold text-neutral-900 truncate cursor-pointer hover:underline"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveWishlist(product)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {product.category} · {product.specs.cushioning}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono font-bold tabular-nums text-neutral-950">
                        {formatPrice(product.price, currency)}
                      </span>

                      <button
                        onClick={() => {
                          onQuickAdd(product, product.sizes[2] || product.sizes[0], product.defaultColorIndex || 0);
                        }}
                        className="flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add To Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
