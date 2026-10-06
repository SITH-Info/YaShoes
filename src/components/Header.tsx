import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Package, Sparkles, User, Scale } from 'lucide-react';
import { ShoeCategory, CurrencyCode, UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  activeCategory: ShoeCategory | 'All';
  onSelectCategory: (cat: ShoeCategory | 'All') => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenCustomizer: () => void;
  onOpenQuiz: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  user: UserProfile | null;
  onOpenAccount: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  ordersCount,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenCustomizer,
  onOpenQuiz,
  searchQuery,
  onSearchChange,
  currency,
  onChangeCurrency,
  user,
  onOpenAccount,
  compareCount,
  onOpenCompare,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks: { label: string; value: ShoeCategory | 'All' | 'custom' | 'quiz' }[] = [
    { label: 'Shop All', value: 'All' },
    { label: 'Running', value: 'Running' },
    { label: 'Lifestyle', value: 'Lifestyle' },
    { label: 'Trail & Boots', value: 'Trail' },
    { label: 'Custom Studio', value: 'custom' },
    { label: 'Shoe Quiz', value: 'quiz' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Slim Promotional Notification Strip */}
      <div className="bg-[#121316] text-[#e4e4e7] px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-3">
        <span>
          {currency === 'INR'
            ? 'Free express delivery across India on orders over ₹4,999'
            : 'Free express worldwide delivery on orders over $150'}
        </span>
        <span className="text-neutral-500 hidden sm:inline" aria-hidden="true">·</span>
        <span className="text-amber-400 hidden sm:inline">Spring 2026 Drop Now Live</span>
      </div>

      {/* Strict One-Row Three-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Title (Single text element wordmark in display face) */}
        <button
          onClick={() => {
            onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-neutral-900 hover:opacity-85 transition-opacity whitespace-nowrap text-left"
        >
          YaShoes
        </button>

        {/* Zone 2: 4–6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isCustom = link.value === 'custom';
            const isQuiz = link.value === 'quiz';
            const isActive = !isCustom && !isQuiz && activeCategory === link.value;

            return (
              <button
                key={link.label}
                onClick={() => {
                  if (isCustom) {
                    onOpenCustomizer();
                  } else if (isQuiz) {
                    onOpenQuiz();
                  } else {
                    onSelectCategory(link.value as ShoeCategory | 'All');
                  }
                }}
                className={`relative py-1 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-neutral-950 font-semibold'
                    : 'hover:text-neutral-950 text-neutral-600'
                }`}
              >
                {isCustom && <Sparkles className="w-3.5 h-3.5 text-amber-600 inline" />}
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Affordances */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
              className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md px-2 py-1.5 border-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400"
              aria-label="Select currency"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-neutral-100 rounded-lg px-2.5 py-1 border border-neutral-300">
                <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search sheos, specs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-32 sm:w-48 bg-transparent text-xs focus:outline-none text-neutral-900"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearchInput(false);
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setShowSearchInput(false);
                    }}
                    className="text-neutral-400 hover:text-neutral-700 text-xs ml-1 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Search products"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Track Orders Affordance */}
          <button
            onClick={onOpenOrders}
            className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors relative hidden sm:block"
            title="Track Orders"
            aria-label="Track Orders"
          >
            <Package className="w-5 h-5" />
            {ordersCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>

          {/* Compare Affordance */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors relative"
              title="Compare selected footwear"
              aria-label="Compare selected footwear"
            >
              <Scale className="w-5 h-5 text-neutral-800" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors relative"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Profile / Sign In Button */}
          <button
            onClick={onOpenAccount}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              user
                ? 'border-neutral-300 bg-neutral-50 hover:border-neutral-950 text-neutral-900 shadow-2xs'
                : 'border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
            title={user ? `${user.name} (${user.clubTier} Member)` : 'Sign In / Account'}
            aria-label="Account"
          >
            {user ? (
              <>
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-20 truncate">{user.name.split(' ')[0]}</span>
                <span className="hidden md:inline text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {user.clubTier}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </>
            )}
          </button>

          {/* Shopping Bag Button (Primary Action) */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Category Quick Bar */}
      <div className="lg:hidden border-t border-neutral-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isCustom = link.value === 'custom';
          const isQuiz = link.value === 'quiz';
          const isActive = !isCustom && !isQuiz && activeCategory === link.value;

          return (
            <button
              key={`mob-${link.label}`}
              onClick={() => {
                if (isCustom) onOpenCustomizer();
                else if (isQuiz) onOpenQuiz();
                else onSelectCategory(link.value as ShoeCategory | 'All');
              }}
              className={`text-xs px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
