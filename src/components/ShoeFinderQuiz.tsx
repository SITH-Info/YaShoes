import React, { useState } from 'react';
import { X, Compass, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface ShoeFinderQuizProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
}

export const ShoeFinderQuiz: React.FC<ShoeFinderQuizProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [activity, setActivity] = useState<string>('running');
  const [cushion, setCushion] = useState<string>('responsive');
  const [terrain, setTerrain] = useState<string>('road');

  const questions = [
    {
      step: 1,
      title: 'What is your primary use case?',
      subtitle: 'Tell us how you intend to put mileage on your pairs.',
      options: [
        { id: 'running', label: 'Marathon & Speedwork', desc: 'Lightweight road training, racing, and tempo intervals' },
        { id: 'lifestyle', label: 'City Transit & Everyday', desc: 'Office elegance, all-day walking, dinner, and travel' },
        { id: 'trail', label: 'Mountain & Off-Grid Trails', desc: 'Rocky ascents, technical scree, rain, and mud' },
        { id: 'recovery', label: 'Post-Workout & Lounge', desc: 'Arch relief, poolside downtime, and barefoot comfort' },
      ],
      selected: activity,
      onSelect: (id: string) => setActivity(id),
    },
    {
      step: 2,
      title: 'What cushion sensation do you crave?',
      subtitle: 'Dial in your preferred balance of ground feel vs dampening.',
      options: [
        { id: 'responsive', label: 'Snappy & Propulsive', desc: 'High energy return, spring-loaded toe-off' },
        { id: 'balanced', label: 'Firm & Natural Ground Feel', desc: 'Solid lateral stability and classic foot feel' },
        { id: 'max', label: 'Ultra Plush & Cloud-Soft', desc: 'Maximized stack height for joint protection' },
      ],
      selected: cushion,
      onSelect: (id: string) => setCushion(id),
    },
    {
      step: 3,
      title: 'Primary weather & terrain exposure?',
      subtitle: 'Ensure your outsole tread and upper fabric match the elements.',
      options: [
        { id: 'road', label: 'Dry Pavement & Track', desc: 'Smooth asphalt, high-traction road compounds' },
        { id: 'weather', label: 'Rain, Snow & Unpredictable', desc: 'Waterproof membranes and deep rubber lugs' },
        { id: 'indoor', label: 'Hardwood, Concrete & Urban', desc: 'Non-marking natural rubber cupsoles' },
      ],
      selected: terrain,
      onSelect: (id: string) => setTerrain(id),
    },
  ];

  // Match shoe based on quiz answers
  const recommendedShoe = React.useMemo(() => {
    if (activity === 'running') {
      return cushion === 'max'
        ? products.find((p) => p.id === 'ys-velocity-stride') || products[0]
        : products.find((p) => p.id === 'ys-aeroknit-01') || products[0];
    }
    if (activity === 'trail' || terrain === 'weather') {
      return products.find((p) => p.id === 'ys-terraclimb-gtx') || products[2];
    }
    if (activity === 'recovery') {
      return products.find((p) => p.id === 'ys-monolith-slide') || products[5];
    }
    if (activity === 'lifestyle') {
      return terrain === 'weather'
        ? products.find((p) => p.id === 'ys-nomad-chelsea') || products[1]
        : products.find((p) => p.id === 'ys-retro-court-low') || products[1];
    }
    return products[0];
  }, [activity, cushion, terrain, products]);

  const currentQ = questions.find((q) => q.step === step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-neutral-900" />
            <h3 className="text-xl font-bold font-display text-neutral-950">
              YaShoes Fit Finder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step <= 3 && currentQ ? (
          <div className="py-6 space-y-6">
            {/* Progress indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    step >= num ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Question {step} of 3
              </span>
              <h4 className="text-lg font-bold font-display text-neutral-900 mt-1">
                {currentQ.title}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">{currentQ.subtitle}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = currentQ.selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => currentQ.onSelect(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{opt.label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
              >
                <span>{step === 3 ? 'Reveal My Sheo' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Recommendation Result Screen */
          <div className="py-6 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Perfect Architectural Match Identified</span>
            </div>

            <div>
              <h4 className="text-2xl font-extrabold font-display text-neutral-950">
                {recommendedShoe.name}
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                {recommendedShoe.tagline}
              </p>
            </div>

            {/* Visual Box */}
            <div className="bg-[#F9F9F8] rounded-xl border border-neutral-200 p-4 max-w-sm mx-auto">
              <ShoeVisual
                colorway={recommendedShoe.colorways[0]}
                category={recommendedShoe.category}
                className="w-full h-44"
              />
              <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-200 font-mono">
                <span className="text-neutral-500">Classification: {recommendedShoe.category}</span>
                <span className="font-bold text-neutral-900">
                  {formatPrice(recommendedShoe.price, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs text-neutral-600 hover:text-neutral-950 font-medium flex items-center gap-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={() => {
                  onSelectProduct(recommendedShoe);
                  onClose();
                }}
                className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
