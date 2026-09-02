import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { CountryComparisonRow } from '@/types';
import { SectionHeading } from '@/components/shared/SectionHeading';

interface LocalRetailComparisonTableProps {
  countryName: string;
  rows: CountryComparisonRow[];
  isWorldwide?: boolean;
}

export const LocalRetailComparisonTable: React.FC<LocalRetailComparisonTableProps> = ({
  countryName,
  rows,
  isWorldwide = false,
}) => {
  const competitorHeader = isWorldwide
    ? 'Traditional Domestic Middlemen / Resellers'
    : `Local Retail / Importers in ${countryName}`;

  return (
    <section id="comparison" className="py-16 md:py-24 bg-surface border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Economic & Sourcing Analysis"
          title={`HR Sports Direct Factory vs. ${isWorldwide ? 'Regional Brokers' : `Domestic Retail in ${countryName}`}`}
          description="See why athletic directors, sportswear brands, and corporate purchasers choose direct-to-factory partnership over traditional importer middleman chains."
        />

        {/* Master Comparison Table Container */}
        <div className="border-hairline border-border rounded-base overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white font-mono uppercase tracking-wider text-xs border-b border-zinc-800">
                  <th className="p-4 sm:p-5 w-1/4">Manufacturing Factor</th>
                  <th className="p-4 sm:p-5 w-3/8 bg-ink border-x border-zinc-800 text-surface font-extrabold flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      HR Sports (Direct OEM Factory)
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 w-3/8 text-zinc-400 font-semibold">
                    {competitorHeader}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-ink">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-zinc-50 ${idx % 2 === 1 ? 'bg-surface/30' : 'bg-white'}`}
                  >
                    {/* Category Label */}
                    <td className="p-4 sm:p-5 font-bold font-mono text-xs text-ink bg-zinc-50/50">
                      {row.label}
                    </td>

                    {/* HR Sports Factory Advantage */}
                    <td className="p-4 sm:p-5 font-medium border-x border-border-light bg-surface/10">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{row.hrSports}</span>
                      </div>
                    </td>

                    {/* Domestic Retail Disadvantage */}
                    <td className="p-4 sm:p-5 text-muted">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{row.localRetail}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnote Bar */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted">
          <span>* Benchmark based on verified 2025/2026 industrial export cost studies.</span>
          <span className="hidden sm:inline">100% Itemized Proforma Guarantees</span>
        </div>
      </div>
    </section>
  );
};

export default LocalRetailComparisonTable;
