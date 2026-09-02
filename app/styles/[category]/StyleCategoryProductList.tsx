'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  X,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StyleCategory, StyleProduct, GenderOption, ProductMaterialOption } from '@/types';
import { BorderCard } from '@/components/shared/BorderCard';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { MOQ_LABEL } from '@/lib/constants';

interface StyleCategoryProductListProps {
  category: StyleCategory;
}

export const StyleCategoryProductList: React.FC<StyleCategoryProductListProps> = ({
  category,
}) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<StyleProduct | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderOption>('Men');
  const [selectedMaterial, setSelectedMaterial] = useState<ProductMaterialOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenderSelect = (product: StyleProduct, gender: GenderOption) => {
    setSelectedProduct(product);
    setSelectedGender(gender);
    setSelectedMaterial(product.materials[0]); // Default to first material
    setIsModalOpen(true);
  };

  const handleProceedToQuote = () => {
    if (!selectedProduct || !selectedMaterial) return;

    const params = new URLSearchParams({
      garment: `${selectedProduct.name} (${selectedGender})`,
      fabric: `${selectedMaterial.name} (${selectedMaterial.gsm} GSM)`,
      category: category.slug,
    });

    router.push(`/request-a-quote?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Navigation & Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/#styles"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Categories
        </Link>
      </div>

      {/* Category Header */}
      <div className="max-w-3xl mb-12 border-b border-hairline border-border-light pb-8">
        <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ink" />
          {category.tagline} • {category.itemCount} Garment Types Available
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          {category.name}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {category.products.map((product) => (
          <BorderCard
            key={product.id}
            variant="surface"
            className="p-5 sm:p-6 flex flex-col justify-between h-full bg-white shadow-xs"
          >
            <div>
              {/* Product Image */}
              <div className="relative w-full aspect-4/3 rounded-base overflow-hidden border-hairline border-border-light mb-4 bg-zinc-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-10 hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Product Name */}
              <h3 className="text-xl font-extrabold text-ink tracking-tight mb-2">
                {product.name}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-muted leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Features Pill List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1 mb-5 text-[11px] text-ink font-mono border-t border-border-light pt-3">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Men / Women Selection Buttons */}
              <div className="space-y-3 pt-3 border-t border-border-light">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink flex items-center justify-between">
                  <span>1. Select Sizing Profile:</span>
                  <span className="text-muted text-[10px]">Click to choose material</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.genders.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleGenderSelect(product, gender)}
                      className="px-3 py-2 bg-surface hover:bg-ink hover:text-white border-hairline border-border rounded-base text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                    >
                      <span>{gender}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>

                {/* Step 2: Material Availability Indicator */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-ink" />
                    Available Fabric Options ({product.materials.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.materials.map((mat) => (
                      <span
                        key={mat.id}
                        onClick={() => handleGenderSelect(product, product.genders[0])}
                        className="cursor-pointer bg-surface hover:bg-zinc-200 border-hairline border-border-light text-ink text-[11px] font-mono px-2 py-0.5 rounded-sm transition-colors"
                        title={mat.description}
                      >
                        {mat.name} ({mat.gsm} GSM)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BorderCard>
        ))}
      </div>

      {/* Interactive Material Selection Modal / Drawer */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white border-hairline border-border rounded-base p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-muted hover:text-ink rounded-base border-hairline border-border-light transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 border-b border-border-light pb-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ink" />
                Step 2 / Choose Fabric & Material
              </div>
              <h2 className="text-2xl font-extrabold text-ink tracking-tight">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
                <span className="bg-ink text-white px-2 py-0.5 rounded-sm font-bold uppercase">
                  {selectedGender}&apos;s Cut
                </span>
                <span className="text-muted">• {MOQ_LABEL}</span>
              </div>
            </div>

            {/* Gender Switcher in Modal */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider font-bold text-ink mb-2">
                Selected Sizing Profile:
              </label>
              <div className="flex gap-2">
                {selectedProduct.genders.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGender(g)}
                    className={`px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-hairline rounded-base transition-colors ${
                      selectedGender === g
                        ? 'bg-ink text-white border-ink'
                        : 'bg-surface text-muted border-border hover:text-ink'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Options Grid for this specific product */}
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider font-bold text-ink">
                Select Tailored Fabric Blend:
              </label>

              <div className="space-y-2.5">
                {selectedProduct.materials.map((mat) => {
                  const isSelected = selectedMaterial?.id === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`p-4 border-hairline rounded-base cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-surface border-ink shadow-xs ring-1 ring-ink'
                          : 'bg-white border-border hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-ink">{mat.name}</span>
                          {mat.badge && (
                            <Badge variant="dark" size="sm">
                              {mat.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded-sm border-hairline border-border">
                          {mat.gsm} GSM
                        </span>
                      </div>

                      <div className="text-xs text-ink/80 font-mono mb-1.5">
                        Composition: <strong className="text-ink">{mat.blend}</strong>
                      </div>

                      <p className="text-xs text-muted leading-relaxed mb-2">
                        {mat.description}
                      </p>

                      <div className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>Best for: {mat.bestFor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-mono text-muted text-center sm:text-left">
                Direct factory pricing with sample signoff.
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToQuote}
                className="w-full sm:w-auto gap-2"
              >
                Proceed with this Style & Material
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleCategoryProductList;
