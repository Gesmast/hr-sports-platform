'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Building,
  User,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { mockOrders } from '@/lib/db';
import { PortalOrder, OrderStage } from '@/types';
import { BorderCard } from '@/components/shared/BorderCard';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

const stageSteps: { key: OrderStage; label: string }[] = [
  { key: 'received', label: 'Order Received' },
  { key: 'sample_approved', label: 'Sample Approved' },
  { key: 'in_production', label: 'In Production' },
  { key: 'quality_check', label: 'AQL 1.0 QC' },
  { key: 'shipped', label: 'Dispatched' },
];

export default function PortalPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'all' | 'in_production' | 'shipped'>('all');

  // Filter orders for active user or demo fallback
  const userEmail = session?.user?.email || 'client@demo.com';
  const orders = mockOrders;

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.stage === activeTab);

  const getStageIndex = (stage: OrderStage): number => {
    return stageSteps.findIndex((s) => s.key === stage);
  };

  const getStageBadge = (stage: OrderStage) => {
    switch (stage) {
      case 'received':
        return <Badge variant="outline">Intake Logged</Badge>;
      case 'sample_approved':
        return <Badge variant="surface">Sample Signed Off</Badge>;
      case 'in_production':
        return <Badge variant="warning">In Production</Badge>;
      case 'quality_check':
        return <Badge variant="surface">QC Inspection</Badge>;
      case 'shipped':
        return <Badge variant="success">Shipped DDP</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  return (
    <div className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Client Credentials Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-hairline border-border rounded-base p-6 sm:p-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Authenticated OEM Client Area
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Production Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted font-mono">
              <span className="flex items-center gap-1 text-ink font-semibold">
                <Building className="w-3.5 h-3.5" />
                {(session?.user as any)?.companyName || 'Apex Sports Syndicate'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {session?.user?.email || 'client@demo.com'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/contact">
              <Button variant="primary" size="md" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                New Production Batch
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="gap-1.5 text-muted hover:text-ink"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <BorderCard variant="default" className="p-4 sm:p-5">
            <div className="text-xs text-muted uppercase">Active Production</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              01
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5 font-sans">In mass sublimation</div>
          </BorderCard>

          <BorderCard variant="default" className="p-4 sm:p-5">
            <div className="text-xs text-muted uppercase">Completed / Shipped</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              01
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-sans">In transit (FedEx)</div>
          </BorderCard>

          <BorderCard variant="default" className="p-4 sm:p-5">
            <div className="text-xs text-muted uppercase">Total Units Milled</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              1,650
            </div>
            <div className="text-[11px] text-muted mt-0.5 font-sans">AQL 1.0 Passed</div>
          </BorderCard>

          <BorderCard variant="default" className="p-4 sm:p-5">
            <div className="text-xs text-muted uppercase">Physical Samples</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
              100%
            </div>
            <div className="text-[11px] text-muted mt-0.5 font-sans">Approved before cut</div>
          </BorderCard>
        </div>

        {/* Filter Tabs for Orders */}
        <div className="flex items-center gap-2 border-b border-border-light pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-base font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'all' ? 'bg-ink text-white' : 'bg-white text-muted hover:text-ink border-hairline border-border'
            }`}
          >
            All Production Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('in_production')}
            className={`px-3 py-1.5 rounded-base font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'in_production' ? 'bg-ink text-white' : 'bg-white text-muted hover:text-ink border-hairline border-border'
            }`}
          >
            In Factory (1)
          </button>
          <button
            onClick={() => setActiveTab('shipped')}
            className={`px-3 py-1.5 rounded-base font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'shipped' ? 'bg-ink text-white' : 'bg-white text-muted hover:text-ink border-hairline border-border'
            }`}
          >
            Dispatched (1)
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStageIdx = getStageIndex(order.stage);

            return (
              <BorderCard key={order.id} variant="default" className="p-6 sm:p-8 space-y-6">
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-light pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-extrabold text-ink bg-surface px-2 py-0.5 rounded-sm border-hairline border-border">
                        {order.referenceNumber}
                      </span>
                      {getStageBadge(order.stage)}
                    </div>
                    <h3 className="text-xl font-extrabold text-ink tracking-tight">
                      {order.garmentType}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs text-muted">
                    <div>Quantity: <strong className="text-ink">{order.quantity} Units</strong></div>
                    <div>Est. Delivery: <strong className="text-ink">{order.estimatedDeliveryDate}</strong></div>
                  </div>
                </div>

                {/* Stage Progress Timeline Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-muted mb-1">
                    <span>Manufacturing Milestone</span>
                    <span>{order.productionProgressPercent}% Complete</span>
                  </div>

                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden border-hairline border-border-light">
                    <div
                      className="h-full bg-ink transition-all duration-500 rounded-full"
                      style={{ width: `${order.productionProgressPercent}%` }}
                    />
                  </div>

                  {/* 5 Milestone Step Nodes */}
                  <div className="grid grid-cols-5 gap-1 pt-2 font-mono text-[10px] text-center">
                    {stageSteps.map((step, idx) => {
                      const isPast = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-3.5 h-3.5 rounded-full mb-1 flex items-center justify-center border-hairline ${
                              isCurrent
                                ? 'bg-ink text-white border-ink ring-2 ring-zinc-300'
                                : isPast
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-surface text-muted border-border'
                            }`}
                          >
                            {isPast && <CheckCircle2 className="w-2.5 h-2.5" />}
                          </div>
                          <span className={isCurrent ? 'font-bold text-ink' : 'text-muted'}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details & Logistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface border-hairline border-border rounded-base p-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-muted">Fabric Spec: </span>
                      <span className="font-bold text-ink">{order.material}</span>
                    </div>
                    <div>
                      <span className="text-muted">Sample Signoff: </span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm border-hairline border-emerald-300">
                        {order.sampleStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Order Intake Date: </span>
                      <span className="text-ink">{order.submittedDate}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {order.carrier && (
                      <div>
                        <span className="text-muted">Carrier Gateway: </span>
                        <span className="font-bold text-ink">{order.carrier}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div>
                        <span className="text-muted">Air Waybill / Tracking: </span>
                        <span className="font-bold text-ink underline">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Downloadable Documents Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-ink flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Authorized Production Documents & Certificates
                  </h4>

                  <div className="divide-y divide-border-light border-hairline border-border rounded-base bg-white overflow-hidden text-xs">
                    {order.documents.map((doc) => (
                      <div key={doc.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted shrink-0" />
                          <div>
                            <span className="font-bold text-ink block">{doc.name}</span>
                            <span className="text-[11px] font-mono text-muted">
                              {doc.type.toUpperCase()} • {doc.size} • Issued {doc.date}
                            </span>
                          </div>
                        </div>

                        <a
                          href={doc.downloadUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading verified production document: ${doc.name}`);
                          }}
                          className="px-3 py-1.5 bg-surface hover:bg-zinc-200 text-ink rounded-base font-mono text-[11px] font-bold border-hairline border-border flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
