import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order, ShoeCategory, CurrencyCode, CurrencyConfig, Review, UserProfile } from './types';
import { DEMO_USER } from './data/mockUser';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShoeCustomizerModal } from './components/ShoeCustomizerModal';
import { ShoeFinderQuiz } from './components/ShoeFinderQuiz';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { AccountModal } from './components/AccountModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { CompareModal } from './components/CompareModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Footer } from './components/Footer';

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 85.0 },
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

export default function App() {
  // Products state (allows adding real-time reviews)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Authenticated Member User Profile (Persisted to localStorage)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('YaShoes_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('YaShoes_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('YaShoes_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['ys-aeroknit-01', 'ys-retro-court-low']);
    } catch {
      return new Set(['ys-aeroknit-01']);
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('YaShoes_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Footwear comparison state (up to 3 items)
  const [comparingIds, setComparingIds] = useState<Set<string>>(new Set());

  // Recently viewed products history
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('YaShoes_recently_viewed');
      return saved ? JSON.parse(saved) : ['ys-aeroknit-01', 'ys-retro-court-low'];
    } catch {
      return ['ys-aeroknit-01'];
    }
  });

  // Currency (Default to INR)
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('INR');
  const currency = CURRENCIES[currencyCode];

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productInitialColorIndex, setProductInitialColorIndex] = useState(0);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync user profile to local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('YaShoes_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('YaShoes_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('YaShoes_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('YaShoes_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Sync orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem('YaShoes_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync recently viewed to local storage
  useEffect(() => {
    try {
      localStorage.setItem('YaShoes_recently_viewed', JSON.stringify(recentlyViewedIds));
    } catch {
      // ignore
    }
  }, [recentlyViewedIds]);

  // Track product viewing
  const handleTrackRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 6);
    });
  };

  const handleSelectProduct = (p: Product, initialColorIndex = 0) => {
    setSelectedProduct(p);
    setProductInitialColorIndex(initialColorIndex);
    handleTrackRecentlyViewed(p.id);
  };

  // Comparison Handlers
  const handleToggleCompare = (product: Product) => {
    setComparingIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed ${product.name} from comparison`);
      } else {
        if (next.size >= 3) {
          showToast('You can compare up to 3 models at a time.');
          return prev;
        }
        next.add(product.id);
        showToast(`Added ${product.name} to comparison dock`);
      }
      return next;
    });
  };

  const handleClearCompare = () => {
    setComparingIds(new Set());
  };

  // Add to Cart
  const handleAddToCart = (product: Product, size: number, colorIndex: number, quantity = 1) => {
    const colorway = product.colorways[colorIndex] || product.colorways[0];
    const itemId = `${product.id}-${size}-${colorway.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        size,
        colorway,
        quantity,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name} (US ${size}) to Bag`);
  };

  // Add Custom Shoe to Cart
  const handleAddCustomToCart = (customItem: any) => {
    const customInstanceId = `custom-${Date.now()}`;
    const newItem: CartItem = {
      id: customInstanceId,
      productId: 'custom-studio',
      productName: customItem.name,
      category: customItem.category,
      price: customItem.price,
      size: customItem.size,
      colorway: customItem.colorway,
      quantity: 1,
      customization: customItem.customization,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added Bespoke Pair [${customItem.customization.monogram}] to Bag`);
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  // Remove Cart Item
  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed ${product.name} from Wishlist`);
      } else {
        next.add(product.id);
        showToast(`Saved ${product.name} to Wishlist`);
      }
      return next;
    });
  };

  // Apply Promo
  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'YaShoes10') {
      setAppliedPromo('YaShoes10');
      setPromoDiscountPercent(10);
      return { success: true, message: 'Coupon applied: 10% off your entire order!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setPromoDiscountPercent(0);
      return { success: true, message: 'Free shipping promo code unlocked!' };
    }
    if (clean === 'SPRING20') {
      setAppliedPromo('SPRING20');
      setPromoDiscountPercent(20);
      return { success: true, message: 'Spring 2026 Promo: 20% off applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "YaShoes10" or "SPRING20"' };
  };

  // Order Complete
  const handleOrderComplete = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]); // Clear cart

    if (user) {
      // Award loyalty points based on purchase
      const earnedPoints = Math.round(order.total * (currency.code === 'INR' ? 0.05 : 1));
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          clubPoints: prevUser.clubPoints + earnedPoints,
        };
      });
      showToast(`Order confirmed! Earned +${earnedPoints} Club Reward Points!`);
    } else {
      showToast('Order confirmed successfully!');
    }
  };

  // Add Real-time Review
  const handleAddReview = (productId: string, review: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [review, ...p.reviews];
          const newAvg = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: newAvg,
            reviewCount: p.reviewCount + 1,
          };
        }
        return p;
      })
    );

    // Also update selected product if currently viewing
    setSelectedProduct((prev) => {
      if (prev && prev.id === productId) {
        const updatedReviews = [review, ...prev.reviews];
        const newAvg = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...prev,
          reviews: updatedReviews,
          rating: newAvg,
          reviewCount: prev.reviewCount + 1,
        };
      }
      return prev;
    });

    showToast('Thank you! Your verified review has been published.');
  };

  // Wishlist products array
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  // Products currently in comparison dock
  const comparingProducts = products.filter((p) => comparingIds.has(p.id));

  // Products in recently viewed shelf
  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#121316]">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Bar Header strictly following 3-Zone Contract */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.size}
        ordersCount={orders.length}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => {
          setTrackingOrderId(orders[0]?.id);
          setIsOrdersOpen(true);
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currencyCode}
        onChangeCurrency={setCurrencyCode}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
        compareCount={comparingIds.size}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      <main className="flex-1">
        {/* Campaign Hero Showcase */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onCustomizerClick={() => setIsCustomizerOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
        />

        {/* Product Catalog Grid with Filters, Sizing & Comparison */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currency={currency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={handleSelectProduct}
          onQuickAdd={(p, size, colorIndex) => {
            handleAddToCart(p, size, colorIndex, 1);
          }}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          comparingIds={comparingIds}
          onToggleCompare={handleToggleCompare}
          preferredSize={user?.preferredSize}
        />

        {/* Recently Viewed Footwear Shelf */}
        <RecentlyViewedSection
          products={recentlyViewedProducts}
          onSelectProduct={(p) => handleSelectProduct(p, 0)}
          currency={currency}
        />

        {/* Atelier Craftsmanship & Materials Section */}
        <CraftsmanshipSection />
      </main>

      {/* Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenOrders={() => {
          setTrackingOrderId(orders[0]?.id);
          setIsOrdersOpen(true);
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        initialColorIndex={productInitialColorIndex}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
      />

      <ShoeCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currency={currency}
        onAddCustomToCart={handleAddCustomToCart}
      />

      <ShoeFinderQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        currency={currency}
        onSelectProduct={(p) => {
          handleSelectProduct(p, 0);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedPromo={appliedPromo}
        promoDiscountPercent={promoDiscountPercent}
        onApplyPromo={handleApplyPromo}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currency={currency}
        appliedPromo={appliedPromo}
        promoDiscountPercent={promoDiscountPercent}
        onOrderComplete={handleOrderComplete}
        onOpenOrderTracking={(orderId) => {
          setTrackingOrderId(orderId);
          setIsOrdersOpen(true);
        }}
        user={user}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currency={currency}
        initialOrderId={trackingOrderId}
        onViewInvoice={(order) => {
          setSelectedInvoiceOrder(order);
          setIsInvoiceOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={currency}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(p) => {
          handleSelectProduct(p, 0);
        }}
        onQuickAdd={(p, size, colorIndex) => {
          handleAddToCart(p, size, colorIndex, 1);
        }}
      />

      {/* Member Account & Loyalty Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogin={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name}!`);
        }}
        onLogout={() => {
          setUser(null);
          showToast('Signed out of YaShoes.');
        }}
        onUpdateUser={(updated) => {
          setUser(updated);
          showToast('Profile and preferences updated.');
        }}
        orders={orders}
        currency={currency}
        onViewOrderTracking={(orderId) => {
          setTrackingOrderId(orderId);
          setIsAccountOpen(false);
          setIsOrdersOpen(true);
        }}
        onViewInvoice={(order) => {
          setSelectedInvoiceOrder(order);
          setIsInvoiceOpen(true);
        }}
      />

      {/* Biomechanical Footwear Comparison Dock */}
      <CompareFloatingBar
        products={comparingProducts}
        onOpenCompare={() => setIsCompareOpen(true)}
        onClear={handleClearCompare}
        onRemove={(id) => {
          setComparingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
      />

      {/* Biomechanical Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        productsToCompare={comparingProducts}
        onRemoveProduct={(id) => {
          setComparingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onSelectProduct={(p) => {
          handleSelectProduct(p, 0);
          setIsCompareOpen(false);
        }}
        currency={currency}
      />

      {/* Tax Invoice & GST Bill Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        currency={currency}
      />
    </div>
  );
}
