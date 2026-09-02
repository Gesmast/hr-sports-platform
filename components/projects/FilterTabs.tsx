'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabOption {
  id: string;
  label: string;
}

const tabs: TabOption[] = [
  { id: 'all', label: 'All Case Studies' },
  { id: 'international-leagues', label: 'International Leagues' },
  { id: 'corporate-kits', label: 'Corporate Kits' },
  { id: 'school-uniforms', label: 'School Uniforms' },
  { id: 'activewear', label: 'Technical Activewear' },
];

export const FilterTabs: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleTabChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.replace(`/projects?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'relative px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-colors rounded-base shrink-0 border-hairline',
              isActive
                ? 'text-white border-ink bg-ink'
                : 'text-muted border-border bg-surface hover:text-ink hover:border-ink'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-project-filter"
                className="absolute inset-0 bg-ink rounded-base -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
