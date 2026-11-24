import React from 'react';
import Link from 'next/link';
import {
  Package,
  MessageSquareText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  Palette
} from 'lucide-react';
import { getUserInquiries, getUserOrders, getUserProfile } from '@/app/actions/portal';
import { Button } from '@/components/shared/Button';

export default async function PortalDashboardPage() {
  const [profile, { currentInquiries, pastInquiries }, orders] = await Promise.all([
    getUserProfile(),
    getUserInquiries(),
    getUserOrders(),
  ]);

  const activeOrders = orders.filter((o) => o.order_status === 'in_production');
  const quotesAwaitingReview = currentInquiries.filter(
    (i) => i.status === 'quoted' && !i.isQuoteExpired
  );
  const pendingDesignApprovals = currentInquiries.filter(
    (i) => (i.client_approval_unlocked && !i.design_approved_at) || i.status === 'in_design'
  );

  return (
    <div className="space-y-4 sm:space-y-5 text-black w-full">
      {/* Welcome Banner: Stretches full width, larger text for mobile & tablet */}
      <div className="bg-white rounded-2xl py-4 sm:py-5 px-4 sm:px-6 shadow-xs border border-gray-200/90 w-full">
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Welcome, {profile?.full_name || 'Client Team'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-700 font-medium mt-1 leading-relaxed">
          Manage custom sports apparel production, review factory quotes, and track order progress in real time.
        </p>
      </div>

      {/* KPI Stats Grid: Full width, larger text size on mobile & tablet */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90 hover:border-gray-300 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-zinc-700">
              Current Orders
            </span>
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight my-1">
            {activeOrders.length}
          </div>
          <span className="text-xs text-zinc-600 font-mono block">In factory production</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90 hover:border-gray-300 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-zinc-700 truncate">
              Design Approvals
            </span>
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight my-1">
            {pendingDesignApprovals.length}
          </div>
          <span className="text-xs text-zinc-600 font-mono block">Awaiting sign-off</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90 hover:border-gray-300 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-zinc-700">
              Inquiries
            </span>
            <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight my-1">
            {currentInquiries.length}
          </div>
          <span className="text-xs text-zinc-600 font-mono block">Active inquiries</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90 hover:border-gray-300 transition flex flex-col justify-between">
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-zinc-700 truncate">
              Quote Approvals
            </span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black tracking-tight my-1">
            {quotesAwaitingReview.length}
          </div>
          <span className="text-xs text-zinc-600 font-mono block">Awaiting decision</span>
        </div>
      </div>

      {/* Two Column Grid: Current Inquiries + Active Orders (Stretching full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full">
        {/* Left Column: Recent Current Inquiries */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-black shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">Current Inquiries</h2>
              </div>
              <Link
                href="/portal/inquiries"
                className="text-xs sm:text-sm text-zinc-700 hover:text-black font-bold flex items-center gap-1 transition"
              >
                View all ({currentInquiries.length})
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>

            {currentInquiries.length === 0 ? (
              <div className="py-8 text-center text-xs sm:text-sm text-zinc-600 font-mono">
                No active inquiries currently. Submit a tech pack to receive a commercial quote.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentInquiries.slice(0, 3).map((inquiry) => {
                  const activeQuote = inquiry.quotes?.find((q: any) => q.status === 'active');

                  return (
                    <Link
                      key={inquiry.id}
                      href={`/portal/inquiries/${inquiry.id}`}
                      className="block p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 transition group shadow-2xs w-full"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs sm:text-sm font-mono font-black text-black">
                          {inquiry.reference_id}
                        </span>
                        <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-zinc-200 text-black font-bold">
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="font-bold text-sm sm:text-base text-black truncate">
                        {inquiry.garment_type}
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-700 mt-2 font-mono">
                        <span>{inquiry.quantity} units</span>
                        {activeQuote ? (
                          <span className="text-emerald-800 font-bold">
                            Quoted: ${Number(activeQuote.unit_price).toFixed(2)}/u
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-medium">Awaiting Factory Quote</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <Link href="/request-a-quote">
              <button className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white border border-black text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer">
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Submit Another Inquiry</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Active Manufacturing Orders */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-black shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">Active Orders & Tracking</h2>
              </div>
              <Link
                href="/portal/orders"
                className="text-xs sm:text-sm text-zinc-700 hover:text-black font-bold flex items-center gap-1 transition"
              >
                View all ({orders.length})
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs sm:text-sm text-zinc-600 font-mono">
                No active orders in production. Convert an accepted quote to initiate factory production.
              </div>
            ) : (
              <div className="space-y-2.5">
                {orders.slice(0, 3).map((order) => {
                  const completedCount = order.tracking_stages?.filter(
                    (s: any) => s.status === 'complete'
                  ).length || 0;

                  return (
                    <Link
                      key={order.id}
                      href={`/portal/orders/${order.id}`}
                      className="block p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100/70 transition group shadow-2xs w-full"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs sm:text-sm font-mono font-black text-black">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                          Stage {completedCount}/5
                        </span>
                      </div>
                      <div className="font-bold text-sm sm:text-base text-black truncate">
                        {order.spec_summary?.garment_type || 'Custom Apparel Batch'}
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-700 mt-2 font-mono">
                        <span>{order.total_quantity} units</span>
                        <span className="font-bold text-black">
                          ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-gray-100">
            <Link href="/portal/orders">
              <button className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white border border-black text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer">
                <Truck className="w-4 h-4 text-white" />
                <span>View Orders Tracking</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
