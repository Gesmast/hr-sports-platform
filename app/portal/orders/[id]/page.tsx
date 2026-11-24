import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  Download,
  Building,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getOrderDetails } from '@/app/actions/portal';
import { OrderTrackingTimeline } from '@/components/portal/OrderTrackingTimeline';
import { Button } from '@/components/shared/Button';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderDetails(id);

  if (!order) {
    notFound();
  }

  const shipping = order.shipping_address || {};
  const hasShippingAddress = shipping.street && shipping.city;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Link
          href="/portal/orders"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders List</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Batch #{order.order_number}</span>
        </div>
      </div>

      {/* Order Commercial Header & Specification Overview */}
      <div className="bg-white border border-gray-200 rounded-base p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
              Active Factory Production Order
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {order.spec_summary?.garment_type || 'Custom Apparel Batch'}
            </h1>
            <p className="text-xs font-mono text-muted mt-1">
              Order Ref: <span className="text-ink font-bold">{order.order_number}</span> • Initiated{' '}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {order.pdf_url && (
              <a
                href={order.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-base bg-white hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 text-ink text-xs font-semibold transition border border-gray-200"
              >
                <Download className="w-4 h-4" />
                <span>Production Spec PDF</span>
              </a>
            )}
            {order.inquiry_id && (
              <Link href={`/portal/inquiries/${order.inquiry_id}`}>
                <Button variant="outline" size="sm" className="text-xs hover:border-gray-400 hover:text-gray-900 cursor-pointer">
                  View Source Inquiry
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 4-Column Commercial Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] uppercase font-mono text-muted mb-1">Total Quantity</span>
            <span className="text-xl font-extrabold text-ink block">{order.total_quantity} units</span>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] uppercase font-mono text-muted mb-1">Unit Quoted Price</span>
            <span className="text-xl font-extrabold text-ink block">${Number(order.unit_price).toFixed(2)}</span>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] uppercase font-mono text-muted mb-1">Total Production Value</span>
            <span className="text-xl font-extrabold text-gray-900 block">
              ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3.5 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] uppercase font-mono text-muted mb-1">Fabric Specification</span>
            <span className="text-xs font-semibold text-ink block truncate mt-1">
              {order.spec_summary?.fabric_spec || 'Factory Engineered Spec'}
            </span>
          </div>
        </div>

        {/* Shipping Address Row */}
        <div className="p-4 bg-gray-50/70 rounded-base border border-gray-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-ink block uppercase tracking-wider text-[11px] font-mono">
                Consignee Delivery Address
              </span>
              {hasShippingAddress ? (
                <div className="text-muted mt-1 leading-relaxed">
                  <div>{shipping.street}</div>
                  <div>
                    {shipping.city}, {shipping.state} {shipping.postalCode}
                  </div>
                  <div className="font-semibold text-ink">{shipping.country}</div>
                </div>
              ) : (
                <span className="text-amber-800 italic mt-0.5 block">
                  Pending delivery address verification. Update under Account & Shipping Profile.
                </span>
              )}
            </div>
          </div>

          <Link href="/portal/profile" className="shrink-0">
            <Button variant="outline" size="sm" className="text-xs hover:border-gray-400 hover:text-gray-900 cursor-pointer">
              Update Address
            </Button>
          </Link>
        </div>
      </div>

      {/* 5-Stage Live Production Tracking */}
      <OrderTrackingTimeline
        stages={order.tracking_stages || []}
        carrier={order.tracking_carrier}
        trackingNumber={order.tracking_number}
        shippedAt={order.shipped_at}
      />
    </div>
  );
}
