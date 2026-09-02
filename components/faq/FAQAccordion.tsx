'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/types';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
  items: FAQItem[];
  categoryFilter?: 'ordering' | 'design' | 'production' | 'shipping' | 'payment';
}

const categoryLabels: Record<string, string> = {
  ordering: 'Ordering & MOQ Standards',
  design: 'Design, Vector Files & 3D CAD',
  production: 'Fabric Science & In-Line QC',
  shipping: 'Global Logistics & Customs (DDP)',
  payment: 'Commercial Terms & Payment Methods',
};

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  categoryFilter,
}) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredItems = categoryFilter
    ? items.filter((item) => item.category === categoryFilter)
    : items;

  // Group items by category if not filtered
  const categories = categoryFilter
    ? [categoryFilter]
    : Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-10">
      {categories.map((catKey) => {
        const catItems = filteredItems.filter((i) => i.category === catKey);
        if (catItems.length === 0) return null;

        return (
          <div key={catKey} className="space-y-3">
            {!categoryFilter && (
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-muted pb-2 border-b border-border-light">
                {categoryLabels[catKey] || catKey}
              </h3>
            )}

            <div className="space-y-2">
              {catItems.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="border-hairline border-border rounded-base overflow-hidden bg-white transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-ink text-sm sm:text-base hover:bg-surface transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="leading-snug">{item.question}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-muted shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-180 text-ink'
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-muted leading-relaxed border-t border-border-light bg-surface/40 animate-in fade-in duration-150">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
