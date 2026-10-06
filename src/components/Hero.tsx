import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Compass } from 'lucide-react';
import { ShoeVisual } from './ShoeVisual';
import { ShoeColorway } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onCustomizerClick: () => void;
  onOpenQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onCustomizerClick,
  onOpenQuiz,
}) => {
  const heroColorways: ShoeColorway[] = [
    {
      name: 'Electric Volt Racing',
      hex: '#27272a',
      secondaryHex: '#18181b',
      accentHex: '#84cc16',
      soleHex: '#e4e4e7',
    },
    {
      name: 'Triple Obsidian',
      hex: '#18181b',
      secondaryHex: '#27272a',
      accentHex: '#38bdf8',
      soleHex: '#ffffff',
    },
    {
      name: 'Solar Crimson Hyper',
      hex: '#1f1f23',
      secondaryHex: '#3f3f46',
      accentHex: '#f43f5e',
      soleHex: '#fecdd3',
    },
    {
      name: 'Raw Suede & Bone',
      hex: '#d6c7b2',
      secondaryHex: '#bfae96',
      accentHex: '#b45309',
      soleHex: '#f5f5f4',
    },
  ];

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeAngle, setActiveAngle] = useState<'side' | 'angled' | 'top' | 'sole'>('side');

  const currentColorway = heroColorways[activeColorIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100/80 via-white to-neutral-50/50 border-b border-neutral-200 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial & Call to Action */}
          <div className="lg:col-span-6 space-y-6">
            {/* Clean Unboxed Metadata Line (No Pill Enclosures) */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              <span className="text-neutral-900 font-semibold">SS/26 Collection</span>
              <span aria-hidden="true">·</span>
              <span>Propulsion Foam</span>
              <span aria-hidden="true">·</span>
              <span>Italian Lasting</span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-neutral-950 leading-[1.08] text-balance">
              Form engineered for motion. Sheos built without compromise.
            </h1>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
              Experience the pinnacle of footwear engineering. From nitrogen-infused road racers
              to hand-stitched calfskin court sneakers, YaShoes marries anatomical performance
              with sculptural purity.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 shadow-sm group"
              >
                <span>Shop Featured Sheos</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onCustomizerClick}
                className="px-5 py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Custom Shoe Studio</span>
              </button>

              <button
                onClick={onOpenQuiz}
                className="px-4 py-3.5 text-neutral-700 hover:text-neutral-950 text-xs font-semibold underline underline-offset-4 flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-neutral-500" />
                <span>Take 30s Fit Quiz</span>
              </button>
            </div>

            {/* Adjacency Proof Strip */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-mono text-lg font-bold text-neutral-950 tabular-nums">84%</p>
                <p className="text-xs text-neutral-500 mt-0.5">Energy Return Foam</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-neutral-950 tabular-nums">215g</p>
                <p className="text-xs text-neutral-500 mt-0.5">Sub-marathon Weight</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-neutral-950 tabular-nums">30 Days</p>
                <p className="text-xs text-neutral-500 mt-0.5">Trial & Free Returns</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Visual Box with Ambient Studio Lighting */}
            <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-16/10 bg-gradient-to-b from-neutral-50 to-neutral-200/60 rounded-2xl border border-neutral-200/70 p-6 flex flex-col justify-between shadow-sm overflow-hidden">
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between text-xs text-neutral-500 z-10">
                <span className="font-mono font-medium tracking-wide">AEROKNIT FLUX 01</span>
                <span className="text-[11px] font-semibold text-neutral-700 bg-white/80 px-2 py-0.5 rounded border border-neutral-200">
                  {currentColorway.name}
                </span>
              </div>

              {/* Dynamic Interactive Shoe Visual */}
              <div className="my-auto py-2">
                <ShoeVisual
                  colorway={currentColorway}
                  category="Running"
                  angle={activeAngle}
                  interactiveHover
                  className="w-full h-56"
                />
              </div>

              {/* Perspective Angle Switcher + Color Swatches */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200/60 z-10">
                {/* Angle Controls */}
                <div className="flex items-center bg-neutral-200/60 p-0.5 rounded-md text-[11px] font-medium text-neutral-600">
                  {(['side', 'angled', 'top', 'sole'] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setActiveAngle(angle)}
                      className={`px-2 py-1 rounded capitalize transition-colors ${
                        activeAngle === angle
                          ? 'bg-white text-neutral-950 shadow-2xs font-semibold'
                          : 'hover:text-neutral-900'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1.5" title="Switch Hero Colorway">
                  {heroColorways.map((cw, idx) => (
                    <button
                      key={cw.name}
                      onClick={() => setActiveColorIndex(idx)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        activeColorIndex === idx
                          ? 'border-neutral-950 scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: cw.hex }}
                      aria-label={`Select ${cw.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Full carbon-plate shank · Free exchanges on all sizing</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
