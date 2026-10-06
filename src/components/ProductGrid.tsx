import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { Product, ShoeCategory, GenderCategory, CurrencyConfig } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ShoeCategory | 'All';
  onSelectCategory: (cat: ShoeCategory | 'All') => void;
  currency: CurrencyConfig;
  wishlistIds: Set<string>;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product, initialColorIndex?: number) => void;
  onQuickAdd: (p: Product, size: number, colorIndex: number) => void;
  searchQuery: string;
  onClearSearch: () => void;
  comparingIds?: Set<string>;
  onToggleCompare?: (p: Product) => void;
  preferredSize?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  currency,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  searchQuery,
  onClearSearch,
  comparingIds,
  onToggleCompare,
  preferredSize,
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderCategory>('All');
  const [selectedCushion, setSelectedCushion] = useState<'All' | 'Responsive' | 'Balanced' | 'Max Cushion'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const categories: (ShoeCategory | 'All')[] = [
    'All',
    'Running',
    'Lifestyle',
    'Trail',
    'Boots',
    'Slides',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Gender filter
        if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') {
          return false;
        }
        // Cushioning filter
        if (selectedCushion !== 'All' && p.specs.cushioning !== selectedCushion) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchSpecs =
            p.specs.upperMaterial.toLowerCase().includes(q) ||
            p.specs.terrain.toLowerCase().includes(q);
          if (!matchName && !matchTagline && !matchSpecs) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedGender, selectedCushion, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedGender !== 'All' ||
    selectedCushion !== 'All' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    onSelectCategory('All');
    setSelectedGender('All');
    setSelectedCushion('All');
    onClearSearch();
  };

  return (
    <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            <span>The Catalog</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{filteredProducts.length} Models Available</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-display text-neutral-950">
            {selectedCategory === 'All' ? 'Complete Footwear Archive' : `${selectedCategory} Collection`}
          </h2>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-neutral-300 rounded-lg px-3 py-1.5 shadow-2xs text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors shadow-2xs ${
              showFiltersDrawer || hasActiveFilters
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Category Segmented Bar (Allowed Buttons / Tabs) */}
      <div className="flex items-center justify-between gap-4 py-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg shrink-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Clear Filters helper */}
        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {showFiltersDrawer && (
        <div className="bg-neutral-50/90 border border-neutral-200 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
          <div>
            <label className="font-semibold text-neutral-800 block mb-2">Gender / Fit:</label>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Men', 'Women', 'Unisex'] as GenderCategory[]).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedGender === gender
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-800 block mb-2">Cushioning Level:</label>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Responsive', 'Balanced', 'Max Cushion'] as const).map((cushion) => (
                <button
                  key={cushion}
                  onClick={() => setSelectedCushion(cushion)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedCushion === cushion
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {cushion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={() => setShowFiltersDrawer(false)}
              className="text-neutral-500 hover:text-neutral-900 text-xs font-medium py-1 px-2"
            >
              Done Filtering
            </button>
          </div>
        </div>
      )}

      {/* Active Search feedback */}
      {searchQuery && (
        <div className="flex items-center gap-2 mb-6 text-xs text-neutral-600 bg-neutral-100 p-2.5 rounded-lg">
          <span>Search results for <strong>"{searchQuery}"</strong></span>
          <button
            onClick={onClearSearch}
            className="text-neutral-500 hover:text-neutral-900 font-bold ml-auto"
          >
            Clear
          </button>
        </div>
      )}

      {/* Product Grid: 3-column (desktop) with gap-6 to gap-8 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              isComparing={comparingIds?.has(product.id)}
              onToggleCompare={onToggleCompare}
              preferredSize={preferredSize}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200 p-8">
          <p className="text-lg font-semibold text-neutral-800 font-display">No footwear matches your filters</p>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search criteria or resetting filters to see our full catalogue.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
