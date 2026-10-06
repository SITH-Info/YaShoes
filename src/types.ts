export type ShoeCategory = 'Running' | 'Lifestyle' | 'Trail' | 'Boots' | 'Slides';
export type GenderCategory = 'All' | 'Men' | 'Women' | 'Unisex';

export interface ShoeColorway {
  name: string;
  hex: string;
  secondaryHex: string;
  accentHex: string;
  soleHex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fit: 'True to Size' | 'Runs Small' | 'Runs Large';
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ShoeCategory;
  gender: GenderCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  story: string;
  specs: {
    weight: string;
    drop: string;
    cushioning: 'Responsive' | 'Balanced' | 'Max Cushion';
    terrain: string;
    upperMaterial: string;
    midsole: string;
    outsole: string;
  };
  sizes: number[];
  colorways: ShoeColorway[];
  defaultColorIndex: number;
  features: string[];
  reviews: Review[];
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productName: string;
  category: ShoeCategory;
  price: number;
  size: number;
  colorway: ShoeColorway;
  quantity: number;
  customization?: {
    isCustom: boolean;
    monogram?: string;
    upperHex?: string;
    soleHex?: string;
    accentHex?: string;
    lacesHex?: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Processing' | 'Assembling' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export interface Address {
  id: string;
  title: string; // e.g. 'Home', 'Office'
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethodItem {
  id: string;
  type: 'upi' | 'card';
  title: string;
  identifier: string; // e.g. 'aarav@okhdfcbank' or '•••• 4242'
  expiry?: string;
  isDefault: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  size: number;
  reason: string;
  status: 'Requested' | 'Courier Scheduled' | 'Inspected' | 'Refund Processed';
  refundAmount: number;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredSize: number;
  preferredWidth: 'Regular' | 'Wide';
  archType: 'Neutral' | 'High Arch' | 'Flat Feet';
  clubTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  clubPoints: number;
  addresses: Address[];
  paymentMethods: PaymentMethodItem[];
  returns: ReturnRequest[];
  joinDate: string;
  notificationsEnabled: boolean;
}

