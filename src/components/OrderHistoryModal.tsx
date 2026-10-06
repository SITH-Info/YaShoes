import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle2, Clock, MapPin, Search, FileText } from 'lucide-react';
import { Order, CurrencyConfig } from '../types';
import { ShoeVisual } from './ShoeVisual';
import { formatPrice } from '../utils/formatPrice';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: CurrencyConfig;
  initialOrderId?: string;
  onViewInvoice?: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  initialOrderId,
  onViewInvoice,
}) => {
  if (!isOpen) return null;

  // Fallback demo order localized to the active currency
  const sampleOrders: Order[] = orders.length > 0 ? orders : [
    {
      id: 'YS-849201',
      date: 'Oct 3, 2026',
      items: [
        {
          id: 'sample-1',
          productId: 'ys-aeroknit-01',
          productName: 'YaShoes AeroKnit Flux 01',
          category: 'Running',
          price: 185,
          size: 10,
          colorway: {
            name: 'Volt Racing',
            hex: '#27272a',
            secondaryHex: '#18181b',
            accentHex: '#84cc16',
            soleHex: '#facc15',
          },
          quantity: 1,
        },
      ],
      subtotal: 185,
      discount: 0,
      shipping: 0,
      tax: 15,
      total: 200,
      status: 'Shipped',
      estimatedDelivery: currency.code === 'INR' ? 'Oct 8, 2026 (BlueDart Air)' : 'Oct 8, 2026',
      shippingAddress: {
        fullName: currency.code === 'INR' ? 'Aarav Sharma' : 'Jordan Taylor',
        street: currency.code === 'INR' ? '42, 100 Feet Road, Indiranagar' : '742 Evergreen Terrace',
        city: currency.code === 'INR' ? 'Bengaluru' : 'Seattle',
        state: currency.code === 'INR' ? 'Karnataka' : 'WA',
        zipCode: currency.code === 'INR' ? '560038' : '98101',
        country: currency.code === 'INR' ? 'India' : 'United States',
      },
      paymentMethod: currency.code === 'INR' ? 'UPI (GPay ···· 4210)' : 'Credit Card (•••• 8912)',
      trackingNumber: 'TRK-98421039',
    },
  ];

  const [activeOrderId, setActiveOrderId] = useState<string>(
    initialOrderId || sampleOrders[0]?.id || ''
  );
  const [lookupQuery, setLookupQuery] = useState('');

  const activeOrder = sampleOrders.find((o) => o.id === activeOrderId) || sampleOrders[0];

  const timelineSteps = [
    { label: 'Order Confirmed', desc: 'Payment cleared & order routed to warehouse', done: true },
    {
      label: 'Crafting & Laser QC',
      desc: 'Midsole inspection and bespoke packaging',
      done: activeOrder?.status !== 'Processing',
    },
    {
      label: 'Carrier Hand-off',
      desc: 'Transferred to DHL Express Air Hub',
      done: activeOrder?.status === 'Shipped' || activeOrder?.status === 'Out for Delivery' || activeOrder?.status === 'Delivered',
    },
    {
      label: 'Out for Delivery',
      desc: 'Local courier vehicle out for final mile',
      done: activeOrder?.status === 'Out for Delivery' || activeOrder?.status === 'Delivered',
    },
    {
      label: 'Delivered',
      desc: 'Signed and delivered at destination doorstep',
      done: activeOrder?.status === 'Delivered',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-neutral-900" />
            <h2 className="text-xl font-bold font-display text-neutral-950">
              Live Order Tracking & Archives
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Orders Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Your Recent Shipments
            </h3>

            <div className="space-y-2">
              {sampleOrders.map((order) => {
                const isSelected = order.id === activeOrderId;
                return (
                  <button
                    key={order.id}
                    onClick={() => setActiveOrderId(order.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold">#{order.id}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {order.date} · {order.items.length} Pair{order.items.length > 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Live Tracking View (8 Cols) */}
          {activeOrder && (
            <div className="lg:col-span-8 space-y-6">
              {/* Order Meta Header */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 text-xs">
                  <div>
                    <span className="text-neutral-500 font-sans">Tracking Reference:</span>{' '}
                    <strong className="font-mono text-neutral-900">{activeOrder.trackingNumber}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-sans">Estimated Delivery:</span>{' '}
                    <strong className="text-neutral-900">{activeOrder.estimatedDelivery}</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <MapPin className="w-4 h-4 text-neutral-800 shrink-0" />
                    <span>
                      Destination: {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city},{' '}
                      {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zipCode}
                    </span>
                  </div>

                  {onViewInvoice && (
                    <button
                      onClick={() => onViewInvoice(activeOrder)}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Tax Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Transit Progression
                </h4>

                <div className="relative pl-6 space-y-5 border-l-2 border-neutral-200 text-xs">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          step.done ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-transparent'
                        }`}
                      >
                        {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </span>

                      <div>
                        <p className={`font-bold ${step.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${step.done ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Included Footwear
                </h4>

                <div className="space-y-2">
                  {activeOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 text-xs"
                    >
                      <div className="w-12 h-12 bg-[#F9F9F8] rounded-lg p-1 shrink-0 border border-neutral-200 flex items-center justify-center">
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
                        <p className="font-bold text-neutral-900 truncate">{item.productName}</p>
                        <p className="text-neutral-500 text-[11px] font-mono">
                          Size US {item.size} · {item.colorway.name} · Qty {item.quantity}
                        </p>
                      </div>

                      <span className="font-mono font-bold tabular-nums text-neutral-950">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
