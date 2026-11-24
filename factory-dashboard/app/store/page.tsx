'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Boxes, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StoreInventoryPage() {
  const { isUrdu, isRoman } = useI18n();

  const inventory = [
    {
      item: 'Interlock 75D Micro Polyester',
      category: 'Fabrics',
      stock: '2,400 meters',
      allocated: '1,200 meters',
      available: '1,200 meters',
      reorderLevel: '500 meters',
      status: 'Healthy Stock',
    },
    {
      item: 'Brushed Fleece 320 GSM (Black)',
      category: 'Fabrics',
      stock: '450 meters',
      allocated: '400 meters',
      available: '50 meters',
      reorderLevel: '300 meters',
      status: 'Low Stock Alert',
    },
    {
      item: 'High-Tenacity 6-Ply Polyester Thread (White)',
      category: 'Trims & Thread',
      stock: '180 cones',
      allocated: '60 cones',
      available: '120 cones',
      reorderLevel: '40 cones',
      status: 'Healthy Stock',
    },
    {
      item: 'Sublimation Transfer Paper 160 GSM (1.6m)',
      category: 'Printing Consumables',
      stock: '18 rolls',
      allocated: '8 rolls',
      available: '10 rolls',
      reorderLevel: '5 rolls',
      status: 'Healthy Stock',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Boxes className="w-6 h-6 text-muted" />
            <span>
              {isUrdu
                ? 'اسٹور و خام مال انوینٹری (عامر)'
                : isRoman
                ? 'Store aur Raw Material Inventory (Aamir)'
                : 'Store & Raw Materials Inventory Desk'}
            </span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'فیبرک رولز، دھاگے، زپرز، سبلیمیشن پیپر اور کٹنگ ڈیپارٹمنٹ ریکوزیشن سلپس'
              : isRoman
              ? 'Fabric rolls, dhagay, zippers, sublimation paper aur cutting department slips'
              : 'Fabric lots, sewing threads, sublimation rolls, and cutting issue vouchers'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inventory.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="font-bold text-ink text-sm block">{item.item}</span>
                <span className="text-[11px] font-mono text-muted">{item.category}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                  item.status.includes('Low')
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                }`}
              >
                {isUrdu
                  ? (item.status.includes('Low') ? 'کم اسٹاک کی اطلاع' : 'مکمل اسٹاک')
                  : isRoman
                  ? (item.status.includes('Low') ? 'Kam Stock Alert' : 'Behtareen Stock')
                  : item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">
                  {isUrdu ? 'اسٹور میں کل' : isRoman ? 'Store Mein Kul' : 'Total In Store'}
                </span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.stock}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">
                  {isUrdu ? 'جاری کاموں میں مخصوص' : isRoman ? 'Chalu Jobs Ko Allocated' : 'Allocated to Active Jobs'}
                </span>
                <span className="font-mono font-semibold text-ink mt-0.5 block">{item.allocated}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">
                  {isUrdu ? 'دستیاب اسٹاک' : isRoman ? 'Dastiyab Free Stock' : 'Free Available'}
                </span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.available}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">
                  {isUrdu ? 'دوبارہ آرڈر کی حد' : isRoman ? 'Dubara Mangwanay Ki Had' : 'Reorder Threshold'}
                </span>
                <span className="font-mono text-muted mt-0.5 block">{item.reorderLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
