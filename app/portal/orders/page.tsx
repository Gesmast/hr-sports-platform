import React from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  PlusCircle,
  FileText
} from 'lucide-react';
import { getUserOrders } from '@/app/actions/portal';
import { Button } from '@/components/shared/Button';

export default async function OrdersListPage() {
  const orders = await getUserOrders();

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Active Factory Batches & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-1">
            Monitor real-time cutting, sublimation, assembly, quality control, and dispatch tracking across 5 production milestones.
          </p>
        </div>

        <Link href="/portal/inquiries">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition cursor-pointer shadow-2xs">
            <Package className="w-4 h-4 text-black" />
            <span>View Inquiries & Quotes</span>
          </button>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center space-y-4 shadow-xs border border-gray-200/80">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-black">
            <Package className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-base font-bold text-black">No Active Orders</h3>
          <p className="text-xs text-zinc-600 font-medium max-w-sm mx-auto leading-relaxed">
            You do not have any active manufacturing orders in production. Review your inquiry quotes and click &quot;Order This&quot; to start factory production.
          </p>
          <div className="pt-2">
            <Link href="/portal/inquiries">
              <button className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer">
                <span>Review Pending Inquiries</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const completedCount = order.tracking_stages?.filter(
              (s: any) => s.status === 'complete'
            ).length || 0;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 hover:border-gray-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-black">
                      {order.order_number}
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-zinc-600 font-mono">
                      Started: {new Date(order.created_at).toLocaleDateString()}
                    </span>

                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      Milestone {completedCount}/5 Complete
                    </span>

                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 font-bold border border-gray-200">
                      {order.order_status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-black">
                    {order.spec_summary?.garment_type || 'Custom Apparel Batch'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-600 font-mono">
                    <span>Units: <strong className="text-black">{order.total_quantity.toLocaleString()}</strong></span>
                    <span>Total Valuation: <strong className="text-black">${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                    {order.target_delivery_date && (
                      <span>Estimated Ship: <strong className="text-black">{new Date(order.target_delivery_date).toLocaleDateString()}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/portal/orders/${order.id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-50 hover:bg-zinc-100 text-black border border-gray-200 hover:border-gray-300 transition cursor-pointer shadow-2xs">
                      <Truck className="w-3.5 h-3.5 text-black" />
                      <span>Track 5-Stage Live Milestones</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
