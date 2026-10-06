import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  const sizeTable = [
    { usMen: 7.0, usWomen: 8.5, uk: 6.0, eu: 40, cm: 25.0, in: 9.8 },
    { usMen: 7.5, usWomen: 9.0, uk: 6.5, eu: 40.5, cm: 25.4, in: 10.0 },
    { usMen: 8.0, usWomen: 9.5, uk: 7.0, eu: 41, cm: 25.8, in: 10.2 },
    { usMen: 8.5, usWomen: 10.0, uk: 7.5, eu: 42, cm: 26.2, in: 10.3 },
    { usMen: 9.0, usWomen: 10.5, uk: 8.0, eu: 42.5, cm: 26.7, in: 10.5 },
    { usMen: 9.5, usWomen: 11.0, uk: 8.5, eu: 43, cm: 27.1, in: 10.7 },
    { usMen: 10.0, usWomen: 11.5, uk: 9.0, eu: 44, cm: 27.5, in: 10.8 },
    { usMen: 10.5, usWomen: 12.0, uk: 9.5, eu: 44.5, cm: 27.9, in: 11.0 },
    { usMen: 11.0, usWomen: 12.5, uk: 10.0, eu: 45, cm: 28.3, in: 11.1 },
    { usMen: 11.5, usWomen: 13.0, uk: 10.5, eu: 45.5, cm: 28.8, in: 11.3 },
    { usMen: 12.0, usWomen: 13.5, uk: 11.0, eu: 46, cm: 29.2, in: 11.5 },
    { usMen: 13.0, usWomen: 14.5, uk: 12.0, eu: 47.5, cm: 30.0, in: 11.8 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h3 className="text-xl font-bold font-display text-neutral-950">
              YaShoes Size Conversion Chart
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between py-4">
          <p className="text-xs text-neutral-500">
            YaShoes fits true to standard Brannock sizing. If between sizes for running, we recommend sizing up 0.5.
          </p>
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-md text-xs shrink-0">
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                unit === 'cm' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                unit === 'in' ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              Inches
            </button>
          </div>
        </div>

        {/* Tabular Sizing Grid */}
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead className="bg-neutral-100 text-neutral-800 uppercase tracking-wider text-[11px] font-sans font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">US Men</th>
                <th className="py-2.5 px-3">US Women</th>
                <th className="py-2.5 px-3">UK</th>
                <th className="py-2.5 px-3">EU</th>
                <th className="py-2.5 px-3">Foot Length ({unit.toUpperCase()})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {sizeTable.map((row) => (
                <tr key={row.usMen} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-2 px-3 font-semibold text-neutral-900">{row.usMen.toFixed(1)}</td>
                  <td className="py-2 px-3">{row.usWomen.toFixed(1)}</td>
                  <td className="py-2 px-3">{row.uk.toFixed(1)}</td>
                  <td className="py-2 px-3">{row.eu}</td>
                  <td className="py-2 px-3 font-medium text-neutral-900">
                    {unit === 'cm' ? `${row.cm} cm` : `${row.in}"`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Steps */}
        <div className="mt-6 bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-xs space-y-2">
          <p className="font-semibold text-neutral-900 font-sans flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            How to measure your foot at home:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-600 pl-1">
            <li>Place a blank sheet of paper flush against a wall on a hard floor.</li>
            <li>Stand on the paper with your heel firmly touching the wall.</li>
            <li>Mark the tip of your longest toe with a pencil held perpendicular.</li>
            <li>Measure the distance from the edge to the mark and match to the chart above.</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Got It, Return to Sheo
          </button>
        </div>
      </div>
    </div>
  );
};
