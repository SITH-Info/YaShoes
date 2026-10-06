import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Gift,
  MapPin,
  Package,
  RotateCcw,
  CreditCard,
  LogOut,
  Sparkles,
  Plus,
  Check,
  ChevronRight,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, Address, Order, CurrencyConfig, ReturnRequest } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { DEMO_USER } from '../data/mockUser';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (u: UserProfile) => void;
  onLogout: () => void;
  onUpdateUser: (u: UserProfile) => void;
  orders: Order[];
  currency: CurrencyConfig;
  onViewOrderTracking: (orderId: string) => void;
  onViewInvoice: (order: Order) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onUpdateUser,
  orders,
  currency,
  onViewOrderTracking,
  onViewInvoice,
}) => {
  if (!isOpen) return null;

  // Active sub-view when logged in
  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'addresses' | 'orders' | 'returns'>('profile');

  // Auth form state when logged out
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authSize, setAuthSize] = useState(10);
  const [forgotSent, setForgotSent] = useState(false);

  // Address add form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');

  // Return request form
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState(orders[0]?.id || 'YS-849201');
  const [returnShoeName, setReturnShoeName] = useState('YaShoes AeroKnit Flux 01');
  const [returnReason, setReturnReason] = useState('Size exchange needed');

  // Rewards redemption coupon generated
  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;

    // Create or login user
    const loggedUser: UserProfile = {
      ...DEMO_USER,
      email: authEmail.trim(),
      name: authName.trim() || authEmail.split('@')[0],
    };
    onLogin(loggedUser);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authName.trim()) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: authName.trim(),
      email: authEmail.trim(),
      phone: authPhone.trim() || '+91 98765 43210',
      preferredSize: authSize,
      preferredWidth: 'Regular',
      archType: 'Neutral',
      clubTier: 'Silver',
      clubPoints: 500, // 500 welcome bonus points!
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      notificationsEnabled: true,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          title: 'Home',
          fullName: authName.trim(),
          street: '100 Feet Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India',
          phone: authPhone.trim() || '+91 98765 43210',
          isDefault: true,
        },
      ],
      paymentMethods: [
        {
          id: `pm-${Date.now()}`,
          type: 'upi',
          title: 'Default UPI',
          identifier: `${authEmail.split('@')[0]}@okaxis`,
          isDefault: true,
        },
      ],
      returns: [],
    };

    onLogin(newUser);
  };

  const handleDemoLogin = () => {
    onLogin(DEMO_USER);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onUpdateUser({ ...user });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAddrStreet.trim()) return;

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      fullName: newAddrFullName.trim() || user.name,
      street: newAddrStreet.trim(),
      city: newAddrCity.trim() || 'Bengaluru',
      state: newAddrState.trim() || 'Karnataka',
      zipCode: newAddrZip.trim() || '560038',
      country: 'India',
      phone: newAddrPhone.trim() || user.phone,
      isDefault: user.addresses.length === 0,
    };

    const updated = {
      ...user,
      addresses: [...user.addresses, newAddress],
    };
    onUpdateUser(updated);
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (addrId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: user.addresses.filter((a) => a.id !== addrId),
    };
    onUpdateUser(updated);
  };

  const handleSetDefaultAddress = (addrId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: user.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addrId,
      })),
    };
    onUpdateUser(updated);
  };

  const handleRedeemPoints = (pointsToRedeem: number) => {
    if (!user || user.clubPoints < pointsToRedeem) return;

    const couponCode = `CLUB-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemedCoupon(couponCode);

    const updated: UserProfile = {
      ...user,
      clubPoints: user.clubPoints - pointsToRedeem,
    };
    onUpdateUser(updated);
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newReturn: ReturnRequest = {
      id: `ret-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: returnOrderId,
      productName: returnShoeName,
      size: user.preferredSize,
      reason: returnReason,
      status: 'Requested',
      refundAmount: 185,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updated: UserProfile = {
      ...user,
      returns: [newReturn, ...user.returns],
    };
    onUpdateUser(updated);
    setShowReturnModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-neutral-900" />
            <h2 className="text-xl font-bold font-display text-neutral-950">
              {user ? 'Member Account & Atelier Pass' : 'YaShoes Member Sign In'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          /* ================= GUEST / AUTHENTICATION VIEW ================= */
          <div className="p-6 sm:p-10 max-w-lg mx-auto w-full space-y-6 text-xs">
            {/* Quick Demo Helper Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 shadow-2xs">
              <div>
                <p className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Instant Demo Member Login</span>
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Pre-loaded with Gold Tier, 1,450 points, sizing preferences, and saved addresses.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-2xs text-xs"
              >
                1-Click Demo Login
              </button>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex border-b border-neutral-200 text-sm font-semibold">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  authMode === 'signin' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  authMode === 'signup' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400'
                }`}
              >
                Join YaShoes Club
              </button>
            </div>

            {authMode === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-neutral-800">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  Sign In to Account
                </button>
              </form>
            ) : authMode === 'signup' ? (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="aarav@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Mobile (+91)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-800 block mb-1">Preferred Shoe Size</label>
                    <select
                      value={authSize}
                      onChange={(e) => setAuthSize(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs font-mono"
                    >
                      {[7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13].map((s) => (
                        <option key={s} value={s}>
                          US {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-neutral-900 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Create Account & Claim 500 Bonus Pts</span>
                </button>
              </form>
            ) : (
              /* Forgot Password */
              <div className="space-y-4">
                <p className="text-neutral-600">
                  Enter your account email to receive a password recovery passcode.
                </p>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2.5 bg-neutral-950 text-white rounded-lg font-semibold"
                >
                  Send Recovery Link
                </button>
                {forgotSent && (
                  <p className="text-emerald-700 text-center font-medium">
                    Reset link simulated and sent to your email.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-neutral-500 hover:text-neutral-900 underline block mx-auto text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================= LOGGED IN MEMBER DASHBOARD ================= */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
            {/* Sidebar Navigation (4 Cols) */}
            <div className="md:col-span-4 border-r border-neutral-200 bg-neutral-50/70 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Member Profile Avatar Card */}
                <div className="flex items-center gap-3 pb-5 border-b border-neutral-200">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-wider font-mono">
                    {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-neutral-950 truncate font-display">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        ★ {user.clubTier} Tier
                      </span>
                    </div>
                  </div>
                </div>

                {/* YaShoes Club Points Pill */}
                <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">YaShoes Club Balance</span>
                    <span className="font-mono font-bold text-amber-600 tabular-nums">
                      {user.clubPoints.toLocaleString('en-IN')} Pts
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Worth {formatPrice(user.clubPoints / currency.rate, currency)} in instant checkout discounts
                  </p>
                </div>

                {/* Navigation Menu Links */}
                <nav className="space-y-1 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'profile' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile & Fit Preferences</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'rewards' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span>Club Rewards & Benefits</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'addresses' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Saved Addresses ({user.addresses.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'orders' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Orders & Invoices ({orders.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('returns')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'returns' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Returns & Exchanges</span>
                  </button>
                </nav>
              </div>

              {/* Sign Out Action */}
              <div className="pt-6 border-t border-neutral-200">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-xs text-neutral-500 hover:text-rose-600 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of YaShoes</span>
                </button>
              </div>
            </div>

            {/* Main Content Details (8 Cols) */}
            <div className="md:col-span-8 p-6 sm:p-8 space-y-6 text-xs">
              {/* TAB 1: Profile & Sizing */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold font-display text-neutral-950">
                      Personal Profile & Sizing Defaults
                    </h3>
                    <p className="text-neutral-500 mt-0.5">
                      Your default shoe sizing will automatically pre-select when browsing any YaShoes silhouette.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Default Shoe Size (US)</label>
                        <select
                          value={user.preferredSize}
                          onChange={(e) => onUpdateUser({ ...user, preferredSize: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs font-mono"
                        >
                          {[7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13].map((s) => (
                            <option key={s} value={s}>
                              US {s} ({(s + 33).toFixed(0)} EU)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Foot Width Profile</label>
                        <select
                          value={user.preferredWidth}
                          onChange={(e) => onUpdateUser({ ...user, preferredWidth: e.target.value as any })}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs"
                        >
                          <option value="Regular">Regular (D Width)</option>
                          <option value="Wide">Wide (EE Width)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-800 block mb-1">Arch Geometry</label>
                        <select
                          value={user.archType}
                          onChange={(e) => onUpdateUser({ ...user, archType: e.target.value as any })}
                          className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs"
                        >
                          <option value="Neutral">Neutral Standard</option>
                          <option value="High Arch">High Arch</option>
                          <option value="Flat Feet">Low / Flat Feet</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-neutral-500 font-mono text-[11px]">Member since {user.joinDate}</span>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: YaShoes Club Rewards */}
              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold font-display text-neutral-950">
                      YaShoes Club Rewards Program
                    </h3>
                    <p className="text-neutral-500 mt-0.5">
                      Earn 1 reward point for every ₹10 spent on authentic YaShoes footwear and bespoke creations.
                    </p>
                  </div>

                  {/* Tier status card */}
                  <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                          Current Tier Status
                        </span>
                        <h4 className="text-2xl font-extrabold font-display">{user.clubTier} Club Member</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-amber-400">
                          {user.clubPoints.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Available Points</p>
                      </div>
                    </div>

                    {/* Tier Progression */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-neutral-400">
                        <span>Gold Tier</span>
                        <span>550 pts to VIP Platinum</span>
                      </div>
                      <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Redeem Points Section */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                      Redeem Points for Checkout Vouchers
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-900">₹500 Instant Discount</p>
                          <p className="text-neutral-500 text-[11px]">Requires 500 Club Points</p>
                        </div>
                        <button
                          onClick={() => handleRedeemPoints(500)}
                          disabled={user.clubPoints < 500}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-lg font-semibold"
                        >
                          Redeem
                        </button>
                      </div>

                      <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-900">₹1,000 Instant Discount</p>
                          <p className="text-neutral-500 text-[11px]">Requires 1,000 Club Points</p>
                        </div>
                        <button
                          onClick={() => handleRedeemPoints(1000)}
                          disabled={user.clubPoints < 1000}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-lg font-semibold"
                        >
                          Redeem
                        </button>
                      </div>
                    </div>

                    {redeemedCoupon && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between">
                        <div>
                          <p className="font-bold">✨ Voucher Unlocked: {redeemedCoupon}</p>
                          <p className="text-[11px]">Enter this code at checkout to claim your instant discount.</p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard?.writeText(redeemedCoupon)}
                          className="px-2.5 py-1 bg-white border border-emerald-300 rounded font-bold text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold font-display text-neutral-950">
                        Saved Delivery Locations
                      </h3>
                      <p className="text-neutral-500 mt-0.5">
                        Addresses saved here are ready for 1-click checkout selection.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {showAddAddress && (
                    <form onSubmit={handleAddAddress} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Address Label</label>
                          <input
                            type="text"
                            placeholder="Home, Office, Beach House"
                            value={newAddrTitle}
                            onChange={(e) => setNewAddrTitle(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Recipient Name</label>
                          <input
                            type="text"
                            placeholder="Aarav Sharma"
                            value={newAddrFullName}
                            onChange={(e) => setNewAddrFullName(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="Flat, suite, street"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">City</label>
                          <input
                            type="text"
                            placeholder="Bengaluru"
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">State</label>
                          <input
                            type="text"
                            placeholder="Karnataka"
                            value={newAddrState}
                            onChange={(e) => setNewAddrState(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">PIN Code</label>
                          <input
                            type="text"
                            placeholder="560038"
                            value={newAddrZip}
                            onChange={(e) => setNewAddrZip(e.target.value)}
                            className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border flex items-start justify-between ${
                          addr.isDefault ? 'border-neutral-900 bg-neutral-50/50 shadow-2xs' : 'border-neutral-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900">{addr.title}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-neutral-800 mt-1">{addr.fullName}</p>
                          <p className="text-neutral-600">{addr.street}</p>
                          <p className="text-neutral-600">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                          <p className="text-neutral-500 font-mono text-[11px] mt-0.5">Phone: {addr.phone}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-neutral-600 hover:text-neutral-950 underline"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[11px] text-rose-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Orders & Invoices */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-neutral-950">
                      Order History & Official Invoices
                    </h3>
                    <p className="text-neutral-500 mt-0.5">
                      Review all past shoe dispatches, download GST invoices, or track active couriers.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-200">
                      <p className="text-neutral-600 font-semibold">No orders placed under this account yet</p>
                      <p className="text-neutral-400 mt-1">Explore our archive and place your first order!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100">
                            <div>
                              <span className="font-mono font-bold text-neutral-900 text-sm">#{ord.id}</span>
                              <span className="text-neutral-400 mx-2">·</span>
                              <span className="text-neutral-500">{ord.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {ord.status}
                              </span>
                              <span className="font-mono font-bold text-neutral-900">
                                {formatPrice(ord.total, currency)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            {ord.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-[11px]">
                                <span className="font-medium text-neutral-800">
                                  {item.productName} (US {item.size}) × {item.quantity}
                                </span>
                                <span className="font-mono text-neutral-500">
                                  {formatPrice(item.price * item.quantity, currency)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            <span className="text-[11px] text-neutral-500 font-mono">
                              Tracking: {ord.trackingNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onViewInvoice(ord)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-800 font-semibold text-[11px] transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Tax Invoice</span>
                              </button>
                              <button
                                onClick={() => {
                                  onViewOrderTracking(ord.id);
                                  onClose();
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-semibold transition-colors"
                              >
                                <span>Track Transit</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Returns & Exchanges */}
              {activeTab === 'returns' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold font-display text-neutral-950">
                        30-Day Risk-Free Returns & Exchanges
                      </h3>
                      <p className="text-neutral-500 mt-0.5">
                        Free doorstep courier pickup on all sizing adjustments and trial returns.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowReturnModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Return</span>
                    </button>
                  </div>

                  {showReturnModal && (
                    <form onSubmit={handleCreateReturn} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Select Order</label>
                        <select
                          value={returnOrderId}
                          onChange={(e) => setReturnOrderId(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-300 text-xs font-mono"
                        >
                          {orders.map((o) => (
                            <option key={o.id} value={o.id}>
                              Order #{o.id} ({o.date})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Shoe Model</label>
                        <input
                          type="text"
                          value={returnShoeName}
                          onChange={(e) => setReturnShoeName(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Reason for Return or Exchange</label>
                        <select
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                        >
                          <option value="Size exchange needed (Too small)">Size exchange needed (Too small)</option>
                          <option value="Size exchange needed (Too large)">Size exchange needed (Too large)</option>
                          <option value="Prefer different colorway">Prefer different colorway</option>
                          <option value="30-day wear trial return">30-day wear trial return (Full refund)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReturnModal(false)}
                          className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold"
                        >
                          Submit Return Request
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {user.returns.map((ret) => (
                      <div key={ret.id} className="p-4 bg-white rounded-xl border border-neutral-200 space-y-1.5 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-neutral-900">{ret.productName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {ret.status}
                          </span>
                        </div>
                        <p className="text-neutral-600 text-[11px]">Reason: {ret.reason}</p>
                        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono pt-1">
                          <span>Ref: {ret.id} · Order #{ret.orderId}</span>
                          <span>Requested: {ret.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
