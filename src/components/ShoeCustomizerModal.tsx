import React, { useState } from 'react';
import { X, Sparkles, RotateCw, Check, ShoppingBag, Eye } from 'lucide-react';
import { ShoeVisual } from './ShoeVisual';
import { CurrencyConfig, ShoeColorway, ShoeCategory } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface ShoeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
  onAddCustomToCart: (customItem: {
    name: string;
    category: ShoeCategory;
    price: number;
    size: number;
    colorway: ShoeColorway;
    customization: {
      isCustom: true;
      monogram: string;
      upperHex: string;
      soleHex: string;
      accentHex: string;
      lacesHex: string;
    };
  }) => void;
}

export const ShoeCustomizerModal: React.FC<ShoeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currency,
  onAddCustomToCart,
}) => {
  if (!isOpen) return null;

  const [baseModel, setBaseModel] = useState<'AeroKnit Flux' | 'Retro Court' | 'TerraClimb'>('AeroKnit Flux');
  const [upperHex, setUpperHex] = useState('#18181b');
  const [soleHex, setSoleHex] = useState('#f4f4f5');
  const [accentHex, setAccentHex] = useState('#38bdf8');
  const [lacesHex, setLacesHex] = useState('#38bdf8');
  const [monogram, setMonogram] = useState('YS');
  const [selectedSize, setSelectedSize] = useState(10);
  const [activeAngle, setActiveAngle] = useState<'side' | 'angled' | 'top' | 'sole'>('side');
  const [added, setAdded] = useState(false);

  const upperPalette = [
    { label: 'Obsidian Black', hex: '#18181b' },
    { label: 'Chalk Bone', hex: '#f5f5f4' },
    { label: 'Alpine Forest', hex: '#166534' },
    { label: 'Royal Cobalt', hex: '#1e40af' },
    { label: 'Desert Terracotta', hex: '#c2410c' },
    { label: 'Vintage Sand', hex: '#d6c7b2' },
  ];

  const solePalette = [
    { label: 'Chalk White', hex: '#f8fafc' },
    { label: 'Raw Bone', hex: '#e7e5e4' },
    { label: 'Matte Stealth', hex: '#18181b' },
    { label: 'Volt Yellow', hex: '#eab308' },
    { label: 'Gum Rubber', hex: '#c8965a' },
  ];

  const accentPalette = [
    { label: 'Sky Cyan', hex: '#38bdf8' },
    { label: 'Volt Green', hex: '#84cc16' },
    { label: 'Solar Crimson', hex: '#f43f5e' },
    { label: 'Amber Gold', hex: '#f59e0b' },
    { label: 'Clean White', hex: '#ffffff' },
    { label: 'Stealth Carbon', hex: '#52525b' },
  ];

  const customColorway: ShoeColorway = {
    name: 'Bespoke Custom Studio',
    hex: upperHex,
    secondaryHex: '#27272a',
    accentHex: accentHex,
    soleHex: soleHex,
  };

  const basePrice = 215;
  const convertedPrice = Math.round(basePrice * currency.rate);

  const handleAddToCart = () => {
    onAddCustomToCart({
      name: `YaShoes Custom Studio · ${baseModel}`,
      category: baseModel === 'AeroKnit Flux' ? 'Running' : baseModel === 'Retro Court' ? 'Lifestyle' : 'Trail',
      price: basePrice,
      size: selectedSize,
      colorway: customColorway,
      customization: {
        isCustom: true,
        monogram: monogram.trim() || 'YS',
        upperHex,
        soleHex,
        accentHex,
        lacesHex,
      },
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-5xl w-full my-auto max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold font-display text-neutral-950">
              YaShoes Bespoke Custom Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Interactive Preview Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-4/3 sm:aspect-16/11 bg-[#F9F9F8] rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800">{baseModel} Bespoke</span>
                <span className="font-mono text-[11px] uppercase tracking-wider">360° Studio Renderer</span>
              </div>

              {/* Shoe Canvas */}
              <div className="my-auto py-2">
                <ShoeVisual
                  colorway={customColorway}
                  category={baseModel === 'AeroKnit Flux' ? 'Running' : baseModel === 'Retro Court' ? 'Lifestyle' : 'Trail'}
                  angle={activeAngle}
                  customUpper={upperHex}
                  customSole={soleHex}
                  customAccent={accentHex}
                  customLaces={lacesHex}
                  monogram={monogram}
                  className="w-full h-56 sm:h-64"
                />
              </div>

              {/* View Angles */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
                <div className="flex items-center gap-1.5 bg-neutral-200/60 p-0.5 rounded-md text-[11px]">
                  {(['side', 'angled', 'top', 'sole'] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setActiveAngle(angle)}
                      className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                        activeAngle === angle ? 'bg-white text-neutral-950 shadow-2xs font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] text-neutral-500 font-mono">
                  Heel ID: [{monogram.slice(0, 3).toUpperCase()}]
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Each pair is hand-lasted by our master cordwainers with custom laser heel stamping. Ships in 5-7 business days.
              </span>
            </div>
          </div>

          {/* Customization Options (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Base Silhouette Selection */}
            <div>
              <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block mb-2">
                1. Select Silhouette Base
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['AeroKnit Flux', 'Retro Court', 'TerraClimb'] as const).map((model) => (
                  <button
                    key={model}
                    onClick={() => setBaseModel(model)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all ${
                      baseModel === model
                        ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Upper Color Palette */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-800 uppercase tracking-wider">2. Upper Colorway</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {upperPalette.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setUpperHex(item.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                      upperHex === item.hex ? 'border-neutral-950 scale-110 shadow-xs' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.label}
                  >
                    {upperHex === item.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Midsole Foam Color */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-800 uppercase tracking-wider">3. Midsole & Outsole</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {solePalette.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSoleHex(item.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                      soleHex === item.hex ? 'border-neutral-950 scale-110 shadow-xs' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.label}
                  >
                    {soleHex === item.hex && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Accent & Laces */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-800 uppercase tracking-wider">4. Dynamic Accent Streak</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {accentPalette.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setAccentHex(item.hex);
                      setLacesHex(item.hex);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                      accentHex === item.hex ? 'border-neutral-950 scale-110 shadow-xs' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: item.hex }}
                    title={item.label}
                  >
                    {accentHex === item.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Monogram / Heel Initials */}
            <div>
              <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block mb-1.5">
                5. Heel Laser Monogram (Max 3 Characters)
              </label>
              <input
                type="text"
                maxLength={3}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                placeholder="e.g. YS"
                className="w-full text-sm font-mono tracking-widest font-bold uppercase p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-neutral-50"
              />
            </div>

            {/* 6. Size Picker */}
            <div>
              <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block mb-1.5">
                6. Select Size (US Men)
              </label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {[8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 font-mono rounded border transition-colors ${
                      selectedSize === s
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add Custom to Cart */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-neutral-500 font-medium">Custom Studio Production</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                  {formatPrice(basePrice, currency)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Custom Pair Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Bespoke Pair · {formatPrice(basePrice, currency)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
