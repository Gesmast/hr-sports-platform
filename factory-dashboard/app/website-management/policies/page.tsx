'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/auth/role-context';
import { useI18n } from '@/lib/i18n/context';
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  Edit3,
  ExternalLink,
  History,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PolicyPreviewModal } from '@/components/website/PolicyPreviewModal';

interface PolicyItem {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'draft' | 'archived';
  contentHash: string;
  contentUpdatedAt: string;
  updatedAt: string;
  versionCount: number;
  currentContent: string;
  versions?: any[];
}

export default function WebsitePoliciesManagementPage() {
  const { currentRole } = useRole();
  const { isUrdu, isRoman } = useI18n();

  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Preview modal
  const [previewPolicy, setPreviewPolicy] = useState<PolicyItem | null>(null);

  // Add policy modal
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSlug, setNewSlug] = useState<string>('');
  const [newContent, setNewContent] = useState<string>(
    '<h2>1. Overview</h2>\n<p>Enter the policy terms and commercial conditions here...</p>'
  );
  const [addingPolicy, setAddingPolicy] = useState<boolean>(false);

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/admin/website/policies');
      if (!res.ok) throw new Error('Failed to fetch website policies');
      const data = await res.json();
      setPolicies(data.policies || []);
    } catch (err: any) {
      console.error(err);
      setActionMessage({ text: err.message || 'Error loading policies', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPolicies();
  };

  // Quick toggle status (Active / Draft)
  const handleToggleStatus = async (policy: PolicyItem) => {
    const nextStatus = policy.status === 'active' ? 'draft' : 'active';
    try {
      const res = await fetch(`/api/admin/website/policies/${policy.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update policy status');

      setPolicies((prev) =>
        prev.map((p) => (p.id === policy.id ? { ...p, status: nextStatus } : p))
      );
      setActionMessage({
        text: `Policy "${policy.title}" status changed to ${nextStatus.toUpperCase()}.`,
        type: 'success',
      });
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    }
  };

  // Create new policy
  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;

    setAddingPolicy(true);
    try {
      const res = await fetch('/api/admin/website/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          content: newContent,
          status: 'active',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create policy');

      setActionMessage({
        text: `Policy "${newTitle}" created successfully! It is now live at /${data.policy.slug}`,
        type: 'success',
      });
      setIsAddOpen(false);
      setNewTitle('');
      setNewSlug('');
      fetchPolicies();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    } finally {
      setAddingPolicy(false);
    }
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter === 'all') return true;
      return p.status === statusFilter;
    });
  }, [policies, searchQuery, statusFilter]);

  if (currentRole !== 'owner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Restricted Access: Owner Console Only</h2>
        <p className="text-sm text-muted max-w-md mb-6">
          Public website policies, legal contracts, and terms are strictly restricted to Executive Management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="underline hover:opacity-80 ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-elevated text-ink border border-border">
              Website Management
            </span>
            <span className="text-xs text-muted font-mono">• Legal Policies &amp; Terms</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {isUrdu
              ? 'پالیسی اور قانونی دستاویزات کی ترتیبات'
              : isRoman
              ? 'Company Policies aur Terms'
              : 'Policies & Legal Documentation'}
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl">
            {isUrdu
              ? 'پبلک ویب سائٹ کی پالیسیوں کو شاپائف طرز کے لیجر میں تبدیل کریں۔ رچ ایڈیٹر، خودکار تاریخ کی حفاظت، اور حقیقی پیش نظارہ۔'
              : isRoman
              ? 'Public website ki legal policies, shipping rules aur terms ko yahan se edit karein.'
              : 'Shopify-style policy management. Edits here directly update the live public website pages. Intelligent content hash tracking guarantees the "Last Updated" timestamp only updates when text changes.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-base border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-base bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Policy</span>
          </button>
        </div>
      </div>

      {/* Visual Theme Editor Integration Callout */}
      <div className="p-4 rounded-2xl border border-border bg-surface-elevated/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-muted">
            You can also visually customize policy page layouts, announcement banners, and section blocks in the{' '}
            <strong className="text-ink">Visual Theme &amp; Content Editor</strong>.
          </span>
        </div>
        <Link
          href="/website-management/theme-editor"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink font-semibold shrink-0 transition"
        >
          <span>Open Visual Editor</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider">Total Policies</div>
          <div className="text-2xl font-bold font-mono text-ink mt-1">{policies.length}</div>
          <div className="text-[11px] text-muted mt-1">Managed legal pages</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider">Active on Website</div>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            {policies.filter((p) => p.status === 'active').length}
          </div>
          <div className="text-[11px] text-muted mt-1">Live for customers</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider">Draft / Internal</div>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
            {policies.filter((p) => p.status === 'draft').length}
          </div>
          <div className="text-[11px] text-muted mt-1">Unpublished revisions</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider">Content Integrity</div>
          <div className="text-2xl font-bold font-mono text-blue-500 mt-1">SHA-256</div>
          <div className="text-[11px] text-muted mt-1">Smart timestamp guard</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies by title or slug (e.g. shipping, returns, privacy)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-base border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${policies.length})` },
            { id: 'active', label: 'Active' },
            { id: 'draft', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-base text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-2xs'
                  : 'bg-surface hover:bg-surface-elevated text-muted hover:text-ink border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shopify-Style Policy Table */}
      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-muted text-sm flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-ink" />
            <span>Loading policies from Supabase...</span>
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="py-16 text-center text-muted text-sm">
            No policies found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-elevated/40 text-[10px] uppercase font-mono tracking-wider text-muted">
                  <th className="py-3 px-4 font-semibold">Policy Title</th>
                  <th className="py-3 px-4 font-semibold">Public Website URL</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold">Last Content Update</th>
                  <th className="py-3 px-4 font-semibold text-center">Version</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPolicies.map((policy) => {
                  const formattedDate = policy.contentUpdatedAt
                    ? new Date(policy.contentUpdatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Original';

                  return (
                    <tr key={policy.id} className="hover:bg-surface-elevated/30 transition">
                      {/* Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-ink shrink-0" />
                          <span>{policy.title}</span>
                        </div>
                      </td>

                      {/* Slug / Public URL */}
                      <td className="py-3.5 px-4">
                        <a
                          href={`${process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'http://localhost:3000'}/${policy.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-muted hover:text-ink flex items-center gap-1 group"
                        >
                          <span>/{policy.slug}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(policy)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                            policy.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              policy.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <span className="capitalize">{policy.status}</span>
                        </button>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-ink text-xs">{formattedDate}</div>
                        <div className="text-[10px] text-muted font-mono">
                          Hash: {policy.contentHash ? policy.contentHash.slice(0, 8) : '—'}
                        </div>
                      </td>

                      {/* Version badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-elevated text-ink border border-border">
                          v{policy.versionCount || 1}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewPolicy(policy)}
                            className="px-2.5 py-1.5 rounded-base border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted" />
                            <span>View</span>
                          </button>

                          <Link
                            href={`/website-management/policies/${policy.id}/edit`}
                            className="px-3 py-1.5 rounded-base bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewPolicy && (
        <PolicyPreviewModal
          isOpen={Boolean(previewPolicy)}
          onClose={() => setPreviewPolicy(null)}
          title={previewPolicy.title}
          slug={previewPolicy.slug}
          content={previewPolicy.currentContent}
          contentUpdatedAt={previewPolicy.contentUpdatedAt}
        />
      )}

      {/* Add Policy Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-surface-elevated/40 flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Add New Legal Policy Page</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-muted hover:text-ink text-sm p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Policy Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug || newSlug === '') {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Sample & MOQ Policy, Custom Branding Agreement"
                  className="w-full px-3 py-2 text-xs rounded-base border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Public Website URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-surface-elevated border border-r-0 border-border rounded-l-base text-xs font-mono text-muted">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                    placeholder="sample-and-moq-policy"
                    className="w-full px-3 py-2 text-xs font-mono rounded-r-base border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Initial Draft Content (HTML)</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-base border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-base text-xs text-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPolicy}
                  className="px-4 py-1.5 rounded-base bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {addingPolicy && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Policy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
