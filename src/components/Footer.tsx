import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ShoeCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ShoeCategory | 'All') => void;
  onOpenCustomizer: () => void;
  onOpenQuiz: () => void;
  onOpenAccount?: () => void;
  onOpenOrders?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCustomizer,
  onOpenQuiz,
  onOpenAccount,
  onOpenOrders,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-600 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter Column (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-extrabold font-display tracking-tight text-neutral-950 block">
              YaShoes
            </span>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Form engineered for motion. An independent footwear laboratory creating high-performance
              runners, artisanal court classics, and technical mountain trail shoes.
            </p>

            {/* Newsletter Subscription */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 max-w-sm pt-2">
              <label className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider block">
                Receive Early Drop Access & Workshop Field Notes
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-neutral-50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  Welcome to the YaShoes dispatch list. We never spam.
                </p>
              )}
            </form>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              The Archive
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('All')} className="hover:text-neutral-950 transition-colors">
                  All Footwear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Running')} className="hover:text-neutral-950 transition-colors">
                  Performance Road & Track
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Lifestyle')} className="hover:text-neutral-950 transition-colors">
                  Hand-Lasted Court Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Trail')} className="hover:text-neutral-950 transition-colors">
                  Technical GTX Trail Shoes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Boots')} className="hover:text-neutral-950 transition-colors">
                  Water-Resistant Chelsea Boots
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Slides')} className="hover:text-neutral-950 transition-colors">
                  Bio-EVA Orthotic Slides
                </button>
              </li>
            </ul>
          </div>

          {/* Studios & Innovation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Interactive Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCustomizer} className="hover:text-neutral-950 transition-colors">
                  3D Customizer Studio
                </button>
              </li>
              <li>
                <button onClick={onOpenQuiz} className="hover:text-neutral-950 transition-colors">
                  30s Footwear Fit Quiz
                </button>
              </li>
              {onOpenAccount && (
                <li>
                  <button onClick={onOpenAccount} className="hover:text-neutral-950 transition-colors">
                    Member Club & Rewards
                  </button>
                </li>
              )}
              {onOpenOrders && (
                <li>
                  <button onClick={onOpenOrders} className="hover:text-neutral-950 transition-colors">
                    Track Orders & Dispatch
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Workshop & Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Atelier Flagships
            </h4>
            <ul className="space-y-1.5 text-neutral-500">
              <li>Bengaluru · Indiranagar 100ft Road</li>
              <li>Mumbai · Bandra West, Linking Rd</li>
              <li>Portland · 1420 NW Lovejoy</li>
              <li>London · 18 Floral St, Covent Garden</li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© 2026 YaShoes Footwear Laboratory Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-600 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-neutral-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-600 cursor-pointer">Material Transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
