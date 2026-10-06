import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import { CartItem, CurrencyConfig, Order, UserProfile } from '../types';
import { ShoeVisual } from './ShoeVisual';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: CurrencyConfig;
  appliedPromo: string;
  promoDiscountPercent: number;
  onOrderComplete: (order: Order) => void;
  onOpenOrderTracking: (orderId: string) => void;
  user?: UserProfile | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  appliedPromo,
  promoDiscountPercent,
  onOrderComplete,
  onOpenOrderTracking,
  user,
}) => {
  if (!isOpen) return null;

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  // Customer Shipping details (pre-fill from user if available)
  const [fullName, setFullName] = useState(defaultAddress?.fullName || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(defaultAddress?.phone || user?.phone || '');
  const [street, setStreet] = useState(defaultAddress?.street || '');
  const [city, setCity] = useState(defaultAddress?.city || (currency.code === 'INR' ? 'Bengaluru' : 'Portland'));
  const [state, setState] = useState(defaultAddress?.state || (currency.code === 'INR' ? 'Karnataka' : 'OR'));
  const [zipCode, setZipCode] = useState(defaultAddress?.zipCode || (currency.code === 'INR' ? '560038' : '97209'));
  const [country, setCountry] = useState(defaultAddress?.country || (currency.code === 'INR' ? 'India' : 'United States'));

  // Points redemption
  const [useClubPoints, setUseClubPoints] = useState(false);
  const clubPointsDiscount = useClubPoints && user && user.clubPoints >= 500
    ? Math.round(500 / currency.rate)
    : 0;

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority' | 'nextday'>('standard');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'applepay' | 'upi'>(
    currency.code === 'INR' ? 'upi' : 'card'
  );
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Generated Order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (promoDiscountPercent / 100));

  const shippingCost =
    shippingMethod === 'nextday'
      ? 25
      : shippingMethod === 'priority'
      ? 12
      : rawSubtotal >= 150 || appliedPromo === 'FREESHIP'
      ? 0
      : 15;

  const taxAmount = Math.round(Math.max(0, rawSubtotal - discountAmount - clubPointsDiscount) * 0.08); // 8% estimated tax
  const finalTotal = Math.max(0, rawSubtotal - discountAmount - clubPointsDiscount + shippingCost + taxAmount);

  const formatPrice = (amount: number) => {
    const locale = currency.code === 'INR' ? 'en-IN' : 'en-US';
    return `${currency.symbol}${Math.round(amount * currency.rate).toLocaleString(locale)}`;
  };

  const handleAutofillDemo = () => {
    if (currency.code === 'INR') {
      setFullName('Aarav Sharma');
      setEmail('aarav.sharma@example.com');
      setPhone('+91 98765 43210');
      setStreet('42, 100 Feet Road, Indiranagar');
      setCity('Bengaluru');
      setState('Karnataka');
      setZipCode('560038');
      setCountry('India');
      setUpiId('aarav@okaxis');
      setCardNumber('6080 •••• •••• 1234');
      setCardExpiry('08/29');
      setCardCvc('482');
    } else {
      setFullName('Sarah Jenkins');
      setEmail('sarah.jenkins@example.com');
      setPhone('+1 (503) 892-4110');
      setStreet('1420 NW Lovejoy Street, Suite 4B');
      setCity('Portland');
      setState('OR');
      setZipCode('97209');
      setCountry('United States');
      setCardNumber('4242 •••• •••• 4242');
      setCardExpiry('08/28');
      setCardCvc('884');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `YS-${Math.floor(100000 + Math.random() * 900000)}`;
    const tracking = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal: rawSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      tax: taxAmount,
      total: finalTotal,
      status: 'Processing',
      estimatedDelivery: currency.code === 'INR' ? '2 to 4 Days (BlueDart Air)' : '3 to 5 Business Days',
      shippingAddress: {
        fullName,
        street,
        city,
        state,
        zipCode,
        country,
      },
      paymentMethod:
        paymentMethod === 'upi'
          ? `UPI (${upiId || 'YaShoes@upi'})`
          : paymentMethod === 'card'
          ? currency.code === 'INR' ? 'RuPay / Card (•••• 1234)' : 'Credit Card (Visa ···· 4242)'
          : paymentMethod === 'applepay'
          ? 'Apple Pay Express'
          : 'Cash on Delivery (COD)',
      trackingNumber: tracking,
    };

    setCompletedOrder(newOrder);
    onOrderComplete(newOrder);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-bold font-display text-neutral-950">
              {step === 'confirmation' ? 'Order Confirmed' : 'YaShoes Secure Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step !== 'confirmation' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            {/* Left Steps Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stepper Progress */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setStep('shipping')}
                  className={`flex items-center gap-1.5 font-semibold ${
                    step === 'shipping' ? 'text-neutral-950 underline underline-offset-4' : 'text-neutral-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Shipping Address</span>
                </button>
                <span className="text-neutral-300">/</span>
                <button
                  onClick={() => {
                    if (fullName && street && zipCode) setStep('payment');
                  }}
                  className={`flex items-center gap-1.5 font-semibold ${
                    step === 'payment' ? 'text-neutral-950 underline underline-offset-4' : 'text-neutral-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Payment & Delivery</span>
                </button>
              </div>

              {/* Demo Autofill Helper & Saved Addresses */}
              {user && user.addresses.length > 0 ? (
                <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-800">Select From Saved Addresses:</span>
                    <button
                      type="button"
                      onClick={handleAutofillDemo}
                      className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Autofill Test Address
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {user.addresses.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setFullName(a.fullName);
                          setStreet(a.street);
                          setCity(a.city);
                          setState(a.state);
                          setZipCode(a.zipCode);
                          setCountry(a.country);
                          setPhone(a.phone);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                          street === a.street
                            ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {a.title}: {a.street.slice(0, 22)}...
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <span className="text-neutral-600">Want to test this checkout instantly?</span>
                  <button
                    type="button"
                    onClick={handleAutofillDemo}
                    className="px-2.5 py-1 bg-white border border-neutral-300 rounded font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
                  >
                    ⚡ Autofill Demo Details
                  </button>
                </div>
              )}

              {step === 'shipping' ? (
                /* Step 1: Shipping Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep('payment');
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Email for Tracking *</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (503) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Apartment, suite, street name"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Portland"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">State / Region *</label>
                      <input
                        type="text"
                        required
                        placeholder="OR"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-neutral-800 block mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="97209"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Continue to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Step 2: Shipping Method & Payment */
                <form onSubmit={handlePlaceOrder} className="space-y-6 text-xs">
                  {/* Delivery Speed Selector */}
                  <div className="space-y-2">
                    <label className="font-semibold text-neutral-800 block">Select Delivery Option:</label>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                          shippingMethod === 'standard' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                          />
                          <div>
                            <p className="font-bold text-neutral-900">Standard Insured Ground (3-5 days)</p>
                            <p className="text-neutral-500 text-[11px]">Carbon-neutral door-to-door transit</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold">
                          {rawSubtotal >= 150 ? 'FREE' : formatPrice(15)}
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                          shippingMethod === 'priority' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'priority'}
                            onChange={() => setShippingMethod('priority')}
                          />
                          <div>
                            <p className="font-bold text-neutral-900">Priority Express Courier (2 days)</p>
                            <p className="text-neutral-500 text-[11px]">Guaranteed signature delivery</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold">{formatPrice(12)}</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                          shippingMethod === 'nextday' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === 'nextday'}
                            onChange={() => setShippingMethod('nextday')}
                          />
                          <div>
                            <p className="font-bold text-neutral-900">Next-Day Morning Air</p>
                            <p className="text-neutral-500 text-[11px]">Dispatched via air freight</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold">{formatPrice(25)}</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <label className="font-semibold text-neutral-800 block">Select Payment Method:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {currency.code === 'INR' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'upi'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="text-xs font-bold block mb-0.5 tracking-wider">UPI / QR</span>
                            <span className="text-[10px]">GPay / PhonePe</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'card'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 mx-auto mb-1" />
                            <span>Cards & RuPay</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'cod'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <Truck className="w-4 h-4 mx-auto mb-1" />
                            <span>Cash on Delivery</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'card'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 mx-auto mb-1" />
                            <span>Credit Card</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('applepay')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'applepay'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="text-sm font-bold block mb-0.5"> Pay</span>
                            <span>Apple Pay</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                              paymentMethod === 'cod'
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <Truck className="w-4 h-4 mx-auto mb-1" />
                            <span>Pay on Delivery</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Details depending on selection */}
                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Enter UPI ID (VPA)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="username@bank (e.g. yourname@okhdfcbank)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 p-2.5 rounded-lg border border-neutral-300 font-mono text-xs focus:outline-none focus:border-neutral-900"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                        <span>Quick formats:</span>
                        <button
                          type="button"
                          onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] : 'user') + '@okhdfcbank')}
                          className="px-2 py-0.5 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
                        >
                          @okhdfcbank
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] : 'user') + '@okaxis')}
                          className="px-2 py-0.5 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
                        >
                          @okaxis
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiId((prev) => (prev ? prev.split('@')[0] : 'user') + '@paytm')}
                          className="px-2 py-0.5 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
                        >
                          @paytm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Details depending on selection */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Expires</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-neutral-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Security CVC</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-neutral-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                      <p className="font-semibold">Cash On Delivery (COD) Selected</p>
                      <p className="text-[11px] text-emerald-700">
                        You can pay in cash or card directly to the courier when your YaShoes package arrives at {street || 'your address'}.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 font-semibold"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Place Order · {formatPrice(finalTotal)}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Summary Column (5 Cols) */}
            <div className="lg:col-span-5 bg-neutral-50/70 p-6 rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-neutral-900 pb-3 border-b border-neutral-200">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
                </h3>

                {/* Items in Checkout */}
                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-200/60 py-2">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 bg-white rounded-lg border border-neutral-200 p-1 shrink-0 flex items-center justify-center">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">{item.productName}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          US {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-bold tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Club Points Redemption Box */}
                {user && user.clubPoints >= 500 && (
                  <div className="my-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-amber-950 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Apply 500 Club Points</span>
                      </p>
                      <p className="text-[11px] text-amber-800">
                        Save {formatPrice(500 / currency.rate)} off this order
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={useClubPoints}
                      onChange={(e) => setUseClubPoints(e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-900 cursor-pointer accent-neutral-900"
                    />
                  </div>
                )}

                {/* Totals Breakdown in Tabular Figures */}
                <div className="space-y-1.5 pt-4 border-t border-neutral-200 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-neutral-600">
                    <span className="font-sans">Subtotal</span>
                    <span>{formatPrice(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span className="font-sans">Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {clubPointsDiscount > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span className="font-sans">YaShoes Club (500 Pts)</span>
                      <span>-{formatPrice(clubPointsDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span className="font-sans">Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span className="font-sans">Estimated Tax</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200 font-mono">
                    <span className="font-sans">Total Due</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1">
                <p className="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & PCI Compliant</span>
                </p>
                <p>30-Day Risk-Free Returns on unworn or road-tested pairs.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Step 3: Order Confirmation Screen */
          completedOrder && (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Payment & Reservation Confirmed
                </span>
                <h3 className="text-3xl font-extrabold font-display text-neutral-950 mt-1">
                  Order #{completedOrder.id}
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                  We've received your order! A confirmation dispatch and digital receipt has been routed to{' '}
                  <strong className="text-neutral-900">{email}</strong>.
                </p>
              </div>

              {/* Order Card Details */}
              <div className="max-w-md mx-auto bg-neutral-50 rounded-2xl border border-neutral-200 p-6 text-left space-y-3 text-xs font-mono">
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500 font-sans">Tracking Reference:</span>
                  <span className="font-bold text-neutral-900">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500 font-sans">Estimated Delivery:</span>
                  <span className="font-bold text-neutral-900">{completedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500 font-sans">Destination:</span>
                  <span className="font-bold text-neutral-900">
                    {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-sans">Payment Mode:</span>
                  <span className="font-bold text-neutral-900">{completedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderTracking(completedOrder.id);
                  }}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Track This Order Live</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs text-neutral-700 hover:text-neutral-950 border border-neutral-300 rounded-lg hover:bg-neutral-50 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
