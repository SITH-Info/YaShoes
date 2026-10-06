import React, { useState } from 'react';
import {
  X,
  Heart,
  Star,
  Ruler,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Minus,
  MessageSquarePlus,
  Scale,
} from 'lucide-react';
import { Product, CurrencyConfig, Review } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { SizeGuideModal } from './SizeGuideModal';
import { formatPrice } from '../utils/formatPrice';

interface ProductDetailModalProps {
  product: Product | null;
  initialColorIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, size: number, colorIndex: number, quantity: number) => void;
  onAddReview: (productId: string, review: Review) => void;
  preferredSize?: number;
  isComparing?: boolean;
  onToggleCompare?: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColorIndex = 0,
  isOpen,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onAddReview,
  preferredSize,
  isComparing = false,
  onToggleCompare,
}) => {
  if (!isOpen || !product) return null;

  const defaultSize = preferredSize && product.sizes.includes(preferredSize)
    ? preferredSize
    : product.sizes[2] || product.sizes[0];

  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);
  const [selectedAngle, setSelectedAngle] = useState<'side' | 'angled' | 'top' | 'sole'>('side');
  const [selectedSize, setSelectedSize] = useState<number | null>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordion state
  const [openSpecs, setOpenSpecs] = useState(true);
  const [openStory, setOpenStory] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewFit, setNewReviewFit] = useState<'True to Size' | 'Runs Small' | 'Runs Large'>('True to Size');

  const currentColorway = product.colorways[selectedColorIndex] || product.colorways[0];
  const convertedPrice = Math.round(product.price * currency.rate);
  const convertedOriginalPrice = product.originalPrice
    ? Math.round(product.originalPrice * currency.rate)
    : null;

  const handleBuy = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize, selectedColorIndex, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim() || 'Exceptional shoe',
      comment: newReviewComment.trim(),
      fit: newReviewFit,
      verified: true,
    };

    onAddReview(product.id, review);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div
          className="relative bg-white rounded-2xl max-w-5xl w-full my-auto max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Close & Wishlist */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium uppercase tracking-wider">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.gender}</span>
              {product.badge && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-900 font-semibold">{product.badge}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onToggleCompare && (
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                    isComparing
                      ? 'bg-neutral-900 text-amber-400'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title={isComparing ? 'Remove from compare' : 'Compare model'}
                >
                  <Scale className="w-4 h-4" />
                  <span className="hidden sm:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
                </button>
              )}

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contiguous PDP Grid: Gallery Left, Purchase Module Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            {/* Gallery Left (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Shoe Viewport */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/11 bg-[#F9F9F8] rounded-2xl border border-neutral-200/80 flex flex-col justify-between p-6 overflow-hidden">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-800">{currentColorway.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider">{selectedAngle} View</span>
                </div>

                {/* Rendered Shoe */}
                <div className="my-auto py-2">
                  <ShoeVisual
                    colorway={currentColorway}
                    category={product.category}
                    angle={selectedAngle}
                    className="w-full h-56 sm:h-64"
                  />
                </div>

                {/* Angle Controls */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-neutral-200/60">
                  {(['side', 'angled', 'top', 'sole'] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setSelectedAngle(angle)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                        selectedAngle === angle
                          ? 'bg-neutral-900 text-white shadow-2xs'
                          : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>Free shipping on all US orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>30-day wear-and-tear trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
                  <span>2-year warranty guarantee</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-neutral-200 pt-4 space-y-3">
                {/* Specs Accordion */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenSpecs(!openSpecs)}
                    className="w-full px-4 py-3 bg-neutral-50 flex items-center justify-between text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <span>Technical Architecture & Materials</span>
                    {openSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSpecs && (
                    <div className="p-4 text-xs space-y-2 bg-white font-mono tabular-nums divide-y divide-neutral-100">
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Total Weight:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.weight}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Heel-To-Toe Drop:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.drop}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Cushioning Classification:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.cushioning}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Surface Matrix:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.terrain}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Upper Construction:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.upperMaterial}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Midsole Polymer:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.midsole}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500 font-sans">Tread Compound:</span>
                        <span className="font-semibold text-neutral-900">{product.specs.outsole}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Story Accordion */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenStory(!openStory)}
                    className="w-full px-4 py-3 bg-neutral-50 flex items-center justify-between text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <span>The Design Philosophy</span>
                    {openStory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openStory && (
                    <div className="p-4 text-xs text-neutral-600 bg-white leading-relaxed">
                      {product.story}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stable Contiguous Purchase Module Right (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* Title & Reviews */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-700">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-mono font-bold text-xs">{product.rating}</span>
                    <span className="text-neutral-400">·</span>
                    <a href="#reviews" className="underline text-neutral-500 hover:text-neutral-900">
                      {product.reviews.length} Customer Reviews
                    </a>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-neutral-950">
                    {product.name}
                  </h1>

                  <p className="text-xs text-neutral-500 leading-normal">
                    {product.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 mt-4 pt-3 border-t border-neutral-200">
                  <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm font-mono text-neutral-400 line-through tabular-nums">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 font-medium ml-auto">
                    In Stock · Ships within 24 Hours
                  </span>
                </div>

                {/* Colorway Selection */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800">
                      Colorway: <span className="text-neutral-500 font-normal">{currentColorway.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colorways.map((cw, idx) => (
                      <button
                        key={cw.name}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                          selectedColorIndex === idx
                            ? 'border-neutral-950 scale-105 shadow-xs'
                            : 'border-transparent hover:scale-105 opacity-80'
                        }`}
                        style={{ backgroundColor: cw.hex }}
                        title={cw.name}
                      >
                        {selectedColorIndex === idx && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800">
                      Select Size (US Men):
                    </span>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-950 underline underline-offset-2 font-medium"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`py-2 text-xs font-mono font-medium rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                              : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50'
                          }`}
                        >
                          US {s}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Fit: 92% of runners report this model fits true to size.
                  </p>
                </div>

                {/* Quantity Stepper & Add To Bag */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-lg p-1 bg-neutral-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-1 text-neutral-600 hover:text-neutral-950 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 text-neutral-600 hover:text-neutral-950"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleBuy}
                      disabled={!selectedSize}
                      className={`flex-1 py-3 px-6 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                        addedAnimation
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-950 hover:bg-neutral-800 text-white disabled:opacity-50'
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Shopping Bag</span>
                        </>
                      ) : (
                        <span>Add To Bag · {formatPrice(product.price * quantity, currency)}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Description */}
                <div className="mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Verification Section */}
          <div id="reviews" className="bg-neutral-50 border-t border-neutral-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-display text-neutral-950">
                  Verified Athlete & Customer Reviews
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Based on real field tests and mileage logged.
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-900 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-2xs"
              >
                <MessageSquarePlus className="w-4 h-4 text-neutral-700" />
                <span>Write A Review</span>
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-xl p-5 border border-neutral-200 space-y-4 shadow-sm animate-in fade-in duration-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Subpar</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Fit Feeling</label>
                    <select
                      value={newReviewFit}
                      onChange={(e) => setNewReviewFit(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    >
                      <option value="True to Size">True to Size</option>
                      <option value="Runs Small">Runs Small</option>
                      <option value="Runs Large">Runs Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Best daily trainer of the year"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Detailed Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share terrain details, comfort, arch support, breathability..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-xl p-4 border border-neutral-200/80 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-900">{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-700 font-medium">· Verified Buyer</span>
                      )}
                    </div>
                    <span className="text-neutral-400 font-mono text-[11px]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-neutral-400 text-xs">·</span>
                    <span className="text-[11px] text-neutral-600 font-medium">{rev.fit}</span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-900">{rev.title}</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
};
