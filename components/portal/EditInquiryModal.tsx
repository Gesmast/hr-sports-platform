'use client';

import React, { useState, useTransition } from 'react';
import { X, Edit3, Loader2, AlertCircle, Sparkles, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/shared/Input';
import { reviseInquiry } from '@/app/actions/portal';

interface EditInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryId: string;
  initialQuantity: number;
  initialFabricSpec?: string;
  initialNotes?: string;
  initialGarmentType?: string;
}

export const EditInquiryModal: React.FC<EditInquiryModalProps> = ({
  isOpen,
  onClose,
  inquiryId,
  initialQuantity,
  initialFabricSpec = '',
  initialNotes = '',
  initialGarmentType = '',
}) => {
  // Store quantity as string so backspacing can cleanly empty the field without stuck zeros
  const [quantity, setQuantity] = useState<string>(String(initialQuantity || 15));
  const [fabricSpec, setFabricSpec] = useState(initialFabricSpec);
  const [notes, setNotes] = useState(initialNotes);
  const [garmentType, setGarmentType] = useState(initialGarmentType);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    // Only accept numeric digits
    const cleaned = val.replace(/[^0-9]/g, '');
    setQuantity(cleaned);
  };

  const adjustQuantity = (delta: number) => {
    const current = parseInt(quantity, 10) || 0;
    const next = Math.max(10, current + delta);
    setQuantity(String(next));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQty = parseInt(quantity, 10);
    if (!numQty || numQty < 10) {
      setError('Minimum production inquiry is 10 units.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await reviseInquiry(inquiryId, {
        quantity: numQty,
        fabricSpec,
        customSpecNotes: notes,
        garmentType: garmentType || undefined,
      });

      if (!res.success && res.error) {
        setError(res.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200/90 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-black">
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5 text-zinc-700 font-mono text-xs font-bold uppercase tracking-wider">
          <Edit3 className="w-4 h-4 text-black" />
          <span>Specification Revision</span>
        </div>

        <h3 className="text-xl font-black text-black tracking-tight mb-1">
          Revise Inquiry Specifications
        </h3>

        <p className="text-xs text-zinc-600 leading-relaxed mb-5">
          Adjust your batch quantity, fabric blend, or requirements. Your changes will be submitted to the accounts desk for an updated quotation.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
              Garment Item
            </label>
            <Input
              type="text"
              required
              value={garmentType}
              onChange={(e) => setGarmentType(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-zinc-50 focus:bg-white"
              placeholder="e.g. Sublimated Match Kit, Cut & Sew Polo"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Quantity Selector with easily backspaceable input and clean +/- steppers */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
                Volume / Units
              </label>
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => adjustQuantity(-5)}
                  className="absolute left-2 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-200 hover:bg-zinc-300 text-black font-bold transition cursor-pointer select-none"
                  title="Decrease 5 units"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="15"
                  className="w-full text-center py-2 px-10 text-xs sm:text-sm font-black bg-zinc-50 focus:bg-white text-black border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black focus:outline-hidden transition"
                />

                <button
                  type="button"
                  onClick={() => adjustQuantity(5)}
                  className="absolute right-2 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-200 hover:bg-zinc-300 text-black font-bold transition cursor-pointer select-none"
                  title="Increase 5 units"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Minimum batch: 10 units</span>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
                Fabric Specification
              </label>
              <Input
                type="text"
                value={fabricSpec}
                onChange={(e) => setFabricSpec(e.target.value)}
                placeholder="e.g. 180 GSM Interlock Poly-Spandex"
                className="text-xs sm:text-sm font-bold bg-zinc-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
              Special Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any changes to collar style, sleeve trim, logo placements, or sizing requirements..."
              className="w-full text-xs sm:text-sm p-3 border border-gray-200 bg-zinc-50 focus:bg-white text-black rounded-xl focus:border-black focus:ring-1 focus:ring-black focus:outline-hidden transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Submitting to HR Sports...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Edit and notify HR Sports</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
