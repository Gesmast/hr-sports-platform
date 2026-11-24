'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ManualJobEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (newJob: any) => void;
  suggestedJobNo?: number;
}

export function ManualJobEntryModal({
  isOpen,
  onClose,
  onJobCreated,
  suggestedJobNo = 269,
}: ManualJobEntryModalProps) {
  const [jobNo, setJobNo] = useState<string>(String(suggestedJobNo));
  const [party, setParty] = useState('');
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [orderQty, setOrderQty] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [fabric, setFabric] = useState('');
  const [processType, setProcessType] = useState('Sublimation');
  const [priority, setPriority] = useState('Normal');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!party.trim() || !product.trim() || !orderQty) {
      setErrorMessage('Party Name, Product, and Order Quantity are required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/data/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_no: jobNo ? parseInt(jobNo, 10) : undefined,
          party: party.trim(),
          client: client.trim() || undefined,
          product: product.trim(),
          order_qty: parseInt(orderQty, 10),
          delivery_date: deliveryDate || undefined,
          fabric: fabric.trim() || undefined,
          process_type: processType,
          priority,
          created_by: 'Owner & Management',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create job');
      }

      if (onJobCreated) {
        onJobCreated(data.job);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white dark:bg-surface rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 select-none"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Manual Job Entry</span>
                <span className="text-[10px] font-mono uppercase bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                  Direct Floor Bypass
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bypass design and quotation approval to allot a production job card immediately.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Job Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Number #
                </label>
                <input
                  type="number"
                  value={jobNo}
                  onChange={(e) => setJobNo(e.target.value)}
                  placeholder="e.g. 269"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Party / Client Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Party / Company *
                </label>
                <input
                  type="text"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  placeholder="e.g. NexGenSim"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              {/* Club / Client Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Club / Division (Optional)
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. London Division"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Product */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product *
                </label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Sublimation Soccer Jersey"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              {/* Order Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Pieces (Qty) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Process Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Process Type
                </label>
                <select
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Sublimation">Full Sublimation</option>
                  <option value="Cut & Sew">Cut & Sew</option>
                  <option value="Only Print">Only Print</option>
                </select>
              </div>

              {/* Fabric */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fabric Type
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Interlock Poly"
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Job...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Job Card</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
