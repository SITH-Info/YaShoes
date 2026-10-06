import React from 'react';
import { X, Printer, Download, CheckCircle2, FileText } from 'lucide-react';
import { Order, CurrencyConfig } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose, currency }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full my-auto border border-neutral-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-display">Tax Invoice / Bill of Supply</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-neutral-800 font-sans print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold font-display tracking-tight text-neutral-950">
                YaShoes
              </h1>
              <p className="text-[11px] text-neutral-500 mt-0.5">Footwear Laboratories Private Limited</p>
              <p className="text-[11px] text-neutral-500">GSTIN / Tax ID: 29AABCY1049M1Z8</p>
              <p className="text-[11px] text-neutral-500">Indiranagar 100ft Road, Bengaluru, Karnataka, 560038</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-neutral-950 bg-neutral-100 px-2 py-1 rounded">
                INVOICE #{order.id}
              </span>
              <p className="text-[11px] text-neutral-500 mt-1.5">Date: {order.date}</p>
              <p className="text-[11px] text-neutral-500">Tracking: {order.trackingNumber}</p>
            </div>
          </div>

          {/* Customer & Billing Address */}
          <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
            <div>
              <p className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider text-neutral-400 mb-1">
                Billed & Shipped To:
              </p>
              <p className="font-bold text-neutral-900">{order.shippingAddress.fullName}</p>
              <p className="text-neutral-600">{order.shippingAddress.street}</p>
              <p className="text-neutral-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
              <p className="text-neutral-600">{order.shippingAddress.country}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider text-neutral-400 mb-1">
                Payment Particulars:
              </p>
              <p className="font-semibold text-neutral-900">{order.paymentMethod}</p>
              <p className="text-emerald-700 font-medium">Payment Status: Paid / Verified</p>
              <p className="text-neutral-500 mt-1">Delivery: {order.status}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead className="bg-neutral-100 uppercase text-[10px] font-sans font-bold text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-neutral-900 font-sans">{item.productName}</p>
                      <p className="text-[11px] text-neutral-500">
                        Size: US {item.size} · {item.colorway.name}
                        {item.customization?.monogram ? ` · Heel [${item.customization.monogram}]` : ''}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500">64041190</td>
                    <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">{formatPrice(item.price, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-neutral-900">
                      {formatPrice(item.price * item.quantity, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Taxes Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 font-mono tabular-nums text-xs">
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Subtotal (Net Amount)</span>
                <span>{formatPrice(order.subtotal, currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-sans">Promotional Discount</span>
                  <span>-{formatPrice(order.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Shipping & Freight</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, currency)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Applicable GST / Taxes (8%)</span>
                <span>{formatPrice(order.tax, currency)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-300 font-bold text-neutral-950 text-sm">
                <span className="font-sans">Grand Total</span>
                <span>{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-400">
            <p className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Digitally verified computer generated tax invoice. No signature required.</span>
            </p>
            <p>YaShoes 30-Day Wear Trial Policy Applied</p>
          </div>
        </div>
      </div>
    </div>
  );
};
