import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  appliedPromo: string;
  promoDiscountPercent: number;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  promoDiscountPercent,
  onApplyPromo,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (promoDiscountPercent / 100));
  const freeShippingThreshold = 150; // In base USD units
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const shippingFee = rawSubtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP' || rawSubtotal === 0 ? 0 : 15;
  const total = rawSubtotal - discountAmount + shippingFee;

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput.trim());
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-lg font-bold font-display text-neutral-950">
              Shopping Bag ({cart.reduce((total, item) => total + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 text-xs">
          {rawSubtotal >= freeShippingThreshold ? (
            <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
              <span>
                {currency.code === 'INR'
                  ? '✨ You unlocked Free Express Delivery across India!'
                  : '✨ You unlocked Free Express Worldwide Delivery!'}
              </span>
            </p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Add <strong>{formatPrice(remainingForFreeShipping, currency)}</strong> for Free Express Delivery</span>
                <span className="font-mono tabular-nums font-semibold">
                  {Math.round((rawSubtotal / freeShippingThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (rawSubtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-400">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-700 font-display">Your bag is currently empty</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Explore our running, lifestyle, and trail archive to find your pair.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Thumbnail Visual */}
                <div className="w-20 h-20 bg-[#F9F9F8] rounded-xl border border-neutral-200 shrink-0 flex items-center justify-center p-1">
                  <ShoeVisual
                    colorway={item.colorway}
                    category={item.category}
                    customUpper={item.customization?.upperHex}
                    customSole={item.customization?.soleHex}
                    customAccent={item.customization?.accentHex}
                    customLaces={item.customization?.lacesHex}
                    monogram={item.customization?.monogram}
                    className="w-full h-full"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-500 mt-0.5 space-y-0.5">
                      <p>
                        Size: <span className="font-mono font-medium text-neutral-800">US {item.size}</span> · {item.colorway.name}
                      </p>
                      {item.customization?.isCustom && (
                        <p className="text-amber-700 flex items-center gap-1 font-mono text-[10px]">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Laser Heel: [{item.customization.monogram}]</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md p-0.5 bg-neutral-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-mono font-bold tabular-nums text-neutral-950">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Checkout Footer */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-200 p-6 bg-neutral-50/50 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromoCode} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Promo (try YaShoes10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-900 rounded-lg text-xs font-semibold text-neutral-800 transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Price Breakdown in Tabular Figures */}
            <div className="space-y-1.5 text-xs font-mono tabular-nums divide-y divide-neutral-200/60 pt-1">
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Subtotal</span>
                <span>{formatPrice(rawSubtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 pt-1">
                  <span className="font-sans">Discount ({appliedPromo})</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600 pt-1">
                <span className="font-sans">Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, currency)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 font-mono">
                <span className="font-sans">Estimated Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Action */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
