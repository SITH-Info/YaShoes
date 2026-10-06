import React, { useState } from 'react';
import { Heart, Star, Eye, Plus, Scale } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product, initialColorIndex?: number) => void;
  onQuickAdd: (p: Product, size: number, colorIndex: number) => void;
  isComparing?: boolean;
  onToggleCompare?: (p: Product) => void;
  preferredSize?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  isComparing = false,
  onToggleCompare,
  preferredSize,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(product.defaultColorIndex || 0);
  const [showQuickSize, setShowQuickSize] = useState(false);

  const currentColorway = product.colorways[selectedColorIndex] || product.colorways[0];
  const formattedPrice = formatPrice(product.price, currency);
  const formattedOriginalPrice = product.originalPrice
    ? formatPrice(product.originalPrice, currency)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:border-neutral-400 hover:shadow-lg transition-all duration-300">
      {/* 65-75% Card Height Image Container on Clean Neutral Backdrop */}
      <div className="relative w-full aspect-4/3 bg-[#F9F9F8] overflow-hidden flex items-center justify-center p-4">
        {/* Subtle Badge (Max 1 subtle unboxed text tag) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold tracking-wider uppercase text-neutral-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-neutral-200/60 shadow-2xs">
            {product.badge}
          </div>
        )}

        {/* Top-Right Action Controls (Wishlist + Compare) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isComparing
                  ? 'bg-neutral-900 text-amber-400 shadow-2xs'
                  : 'bg-white/80 text-neutral-400 hover:text-neutral-900 hover:bg-white shadow-2xs opacity-0 group-hover:opacity-100'
              }`}
              title={isComparing ? 'Remove from compare' : 'Compare specifications'}
              aria-label="Compare specifications"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-2xs'
                : 'bg-white/80 text-neutral-400 hover:text-neutral-900 hover:bg-white shadow-2xs'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Visual Shoe Render */}
        <div
          onClick={() => onSelectProduct(product, selectedColorIndex)}
          className="w-full h-full cursor-pointer flex items-center justify-center"
        >
          <ShoeVisual
            colorway={currentColorway}
            category={product.category}
            interactiveHover
            className="w-full h-44 sm:h-48"
          />
        </div>

        {/* Hover Quick Actions Overlay Bar */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-neutral-200 shadow-sm">
          <button
            onClick={() => onSelectProduct(product, selectedColorIndex)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-neutral-950 px-2 py-1"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            <span>Inspect Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickSize(!showQuickSize);
            }}
            className="flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
        </div>

        {/* Quick Size Popover if toggled */}
        {showQuickSize && (
          <div
            className="absolute inset-x-2 bottom-2 bg-neutral-900/95 backdrop-blur-md p-3 rounded-lg text-white z-20 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-300">Select US Size:</span>
              <button
                onClick={() => setShowQuickSize(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onQuickAdd(product, s, selectedColorIndex);
                    setShowQuickSize(false);
                  }}
                  className="py-1 text-xs font-mono font-medium rounded bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata Line */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-medium tracking-wide uppercase text-[11px]">
              {product.category} · {product.gender}
            </span>
            <div className="flex items-center gap-1 text-neutral-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs font-semibold">{product.rating}</span>
              <span className="text-neutral-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product, selectedColorIndex)}
            className="text-base font-semibold text-neutral-950 group-hover:text-neutral-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.tagline}
          </p>
        </div>

        {/* Bottom Row: Swatches & Tabular Price */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          {/* Interactive Colorway Swatches */}
          <div className="flex items-center gap-1.5" title="Available Colorways">
            {product.colorways.map((cw, idx) => (
              <button
                key={cw.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  selectedColorIndex === idx
                    ? 'border-neutral-950 ring-1 ring-neutral-950 scale-110'
                    : 'border-neutral-300 hover:scale-105 opacity-80'
                }`}
                style={{ backgroundColor: cw.hex }}
                aria-label={cw.name}
              />
            ))}
            {product.colorways.length > 4 && (
              <span className="text-[10px] text-neutral-400 font-mono">
                +{product.colorways.length - 4}
              </span>
            )}
          </div>

          {/* Tabular Price with Optional Strikethrough */}
          <div className="flex items-baseline gap-1.5 text-right font-mono tabular-nums">
            {formattedOriginalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-neutral-950">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
