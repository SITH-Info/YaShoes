import React from 'react';
import { X, Scale, Star, ArrowRight } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsToCompare: Product[];
  onRemoveProduct: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  currency: CurrencyConfig;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  productsToCompare,
  onRemoveProduct,
  onSelectProduct,
  currency,
}) => {
  if (!isOpen) return null;

  const specsRows: { label: string; getVal: (p: Product) => string }[] = [
    { label: 'Category', getVal: (p) => p.category },
    { label: 'Gender / Fit', getVal: (p) => p.gender },
    { label: 'Cushioning Classification', getVal: (p) => p.specs.cushioning },
    { label: 'Total Weight', getVal: (p) => p.specs.weight },
    { label: 'Heel-To-Toe Drop', getVal: (p) => p.specs.drop },
    { label: 'Intended Terrain', getVal: (p) => p.specs.terrain },
    { label: 'Upper Architecture', getVal: (p) => p.specs.upperMaterial },
    { label: 'Midsole Technology', getVal: (p) => p.specs.midsole },
    { label: 'Traction Compound', getVal: (p) => p.specs.outsole },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-5xl w-full my-auto border border-neutral-200 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-neutral-900" />
            <h2 className="text-xl font-bold font-display text-neutral-950">
              Biomechanical Footwear Comparison ({productsToCompare.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {productsToCompare.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <p className="font-bold text-neutral-800 text-sm">No shoes currently staged for comparison</p>
            <p className="text-xs text-neutral-500">
              Click the "Compare" button on any shoe card in the catalog to add models here side-by-side.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="w-48 p-3 text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200">
                    Attribute
                  </th>
                  {productsToCompare.map((prod) => (
                    <th key={prod.id} className="p-3 border-b border-neutral-200 min-w-56 align-top">
                      <div className="relative bg-[#F9F9F8] p-3 rounded-xl border border-neutral-200 flex flex-col justify-between h-48">
                        <button
                          onClick={() => onRemoveProduct(prod.id)}
                          className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-600 rounded bg-white/80"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="my-auto">
                          <ShoeVisual
                            colorway={prod.colorways[0]}
                            category={prod.category}
                            className="w-full h-24"
                          />
                        </div>

                        <div>
                          <p className="font-bold text-neutral-950 truncate text-xs">{prod.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-mono font-bold text-neutral-900">
                              {formatPrice(prod.price, currency)}
                            </span>
                            <span className="text-[11px] text-neutral-500 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {prod.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {specsRows.map((row) => (
                  <tr key={row.label} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-600 text-[11px]">
                      {row.label}
                    </td>
                    {productsToCompare.map((prod) => (
                      <td key={prod.id} className="p-3 text-neutral-800 font-mono text-xs">
                        {row.getVal(prod)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-3" />
                  {productsToCompare.map((prod) => (
                    <td key={prod.id} className="p-3">
                      <button
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs"
                      >
                        <span>Select Model</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
