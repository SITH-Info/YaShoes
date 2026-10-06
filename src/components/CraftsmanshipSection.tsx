import React from 'react';
import { Sparkles, Layers, ShieldCheck, Feather } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section className="bg-neutral-900 text-white py-16 lg:py-24 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <span>Our Workshop Standards</span>
            <span aria-hidden="true">·</span>
            <span>Portland & Civitanova Marche</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            Footwear designed at the intersection of biomechanics and atelier craft.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            We reject throwaway fashion and mass-produced foam wedges. Every YaShoes silhouette is
            prototyped with custom wooden lasts, finite element stress analysis, and circular materials.
          </p>
        </div>

        {/* 3 Editorial Craftsmanship Pillars (Natural 01., 02., 03. numbering per Anti-Slop section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-neutral-800">
          <div className="space-y-3">
            <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
              01. Supercritical Nitrogen Foam
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              84% Energy Rebound Matrix
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Infused with high-pressure supercritical nitrogen, our BioFlow foam expands with uniform micro-cells
              that eliminate the dead sensation typical of standard EVA after 200 miles.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
              02. Vegetable-Tanned Tuscan Calf
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              Zero Harsh Chemicals, Living Patina
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Dyed exclusively with chestnut bark and mimosa flower extracts in Tuscany. The hides retain their natural
              breathability, molding intimately to your unique foot anatomy over months of wear.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
              03. Circular Recyclability
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              Resolable Stitched Construction
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              All cupsoles and Goodyear welts are stitched directly to the upper rather than cemented with toxic glue.
              When your tread wears down after years of transit, send them back to our workshop for full recrafting.
            </p>
          </div>
        </div>

        {/* Studio Proof Stats */}
        <div className="bg-neutral-800/60 rounded-2xl p-6 sm:p-8 border border-neutral-700/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold font-display text-white">
              Experience the difference on your own stride.
            </h4>
            <p className="text-xs text-neutral-400">
              Try any pair for 30 days. If your gait doesn't feel lighter, return for a 100% full refund.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono tabular-nums text-center">
            <div>
              <p className="text-2xl font-bold text-white">30</p>
              <p className="text-[11px] text-neutral-400 font-sans">Days Free Trial</p>
            </div>
            <div className="w-px h-8 bg-neutral-700" />
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-[11px] text-neutral-400 font-sans">Carbon Neutral</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
