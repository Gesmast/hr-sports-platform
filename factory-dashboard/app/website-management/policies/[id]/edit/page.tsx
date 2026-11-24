'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useRole } from '@/lib/auth/role-context';
import { useI18n } from '@/lib/i18n/context';
import {
  ArrowLeft,
  Save,
  Eye,
  History,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { PolicyPreviewModal } from '@/components/website/PolicyPreviewModal';

interface PolicyVersion {
  id: string;
  version_number: number;
  content: string;
  content_hash: string;
  change_summary: string | null;
  created_at: string;
}

interface PolicyDetail {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'draft' | 'archived';
  contentHash: string;
  contentUpdatedAt: string;
  currentContent: string;
  versionCount: number;
  versions: PolicyVersion[];
}

export default function PolicyEditPage() {
  const router = useRouter();
  const params = useParams();
  const policyId = params?.id as string;

  const { currentRole } = useRole();
  const { isUrdu } = useI18n();

  const [policy, setPolicy] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [changeSummary, setChangeSummary] = useState<string>('');

  // UI state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss messages
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Load policy
  const loadPolicy = async () => {
    if (!policyId) return;
    try {
      const res = await fetch(`/api/admin/website/policies/${policyId}`);
      if (!res.ok) throw new Error('Failed to load policy');
      const data = await res.json();
      const p = data.policy;
      setPolicy(p);
      setTitle(p.title);
      setStatus(p.status);
      setContentHtml(p.currentContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = p.currentContent;
      }
    } catch (err: any) {
      console.error(err);
      setActionMessage({ text: err.message || 'Error loading policy', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicy();
  }, [policyId]);

  // Sync content from editable div
  const handleEditorInput = () => {
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Formatting actions
  const applyCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  const handleInsertHeading = (tag: 'h2' | 'h3' | 'p') => {
    applyCommand('formatBlock', `<${tag}>`);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter destination URL:');
    if (url) {
      applyCommand('createLink', url);
    }
  };

  // Image upload directly to Cloudflare R2
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const alt = prompt('Enter Alt description for this image (e.g. Factory Inspection Step):') || 'Policy illustration';

    try {
      setActionMessage({ text: 'Uploading image to Cloudflare R2...', type: 'info' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotKey', policy?.slug || 'policy');
      formData.append('uploadType', 'policy_image');

      const res = await fetch('/api/admin/website/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to upload image');

      applyCommand('insertHTML', `<img src="${data.url}" alt="${alt}" class="my-6 rounded-xl border border-black/10 max-w-full shadow-sm" />`);
      setActionMessage({ text: 'Image inserted successfully!', type: 'success' });
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Image upload failed', type: 'error' });
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Save Policy
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!policy) return;

    setSaving(true);
    const currentHtml = editorRef.current ? editorRef.current.innerHTML : contentHtml;

    try {
      const res = await fetch(`/api/admin/website/policies/${policy.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status,
          content: currentHtml,
          changeSummary: changeSummary || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save policy');

      setChangeSummary('');
      await loadPolicy();

      if (data.contentUpdated) {
        setActionMessage({
          text: `Saved revision v${data.newVersionNumber}! Content changed; "Last Updated" timestamp has been updated on the live website.`,
          type: 'success',
        });
      } else {
        setActionMessage({
          text: `Saved! No textual changes detected; original "Last Updated" date remains preserved.`,
          type: 'info',
        });
      }
    } catch (err: any) {
      console.error(err);
      setActionMessage({ text: err.message || 'Failed to save policy', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Restore past version
  const handleRestoreVersion = async (version: PolicyVersion) => {
    if (!confirm(`Are you sure you want to restore Version v${version.version_number}?`)) return;

    setRestoringVersionId(version.id);
    try {
      const res = await fetch(`/api/admin/website/policies/${policyId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId: version.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to restore version');

      setActionMessage({
        text: `Version v${version.version_number} restored successfully! It is now the active live content.`,
        type: 'success',
      });
      setIsHistoryOpen(false);
      await loadPolicy();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Restore failed', type: 'error' });
    } finally {
      setRestoringVersionId(null);
    }
  };

  if (currentRole !== 'owner') {
    return (
      <div className="p-8 text-center text-sm text-muted">
        Restricted Access: Owner Console Only.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-muted flex flex-col items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-brand" />
        <span>Loading policy editor...</span>
      </div>
    );
  }

  if (!policy) {
    return <div className="p-8 text-center text-sm text-muted">Policy not found.</div>;
  }

  const formattedDate = policy.contentUpdatedAt
    ? new Date(policy.contentUpdatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Original';

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : actionMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
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

      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/website-management/policies"
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-elevated text-ink border border-border">
                WYSIWYG Editor
              </span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'http://localhost:3000'}/${policy.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-muted hover:text-ink flex items-center gap-1"
              >
                <span>{process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'http://localhost:3000'}/{policy.slug}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-ink mt-0.5">
              Editing: {policy.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="px-3 py-1.5 rounded-base border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-muted" />
            <span>Version History ({policy.versionCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1.5 rounded-base border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted" />
            <span>Public Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-1.5 rounded-base bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save &amp; Update Live Site</span>
          </button>
        </div>
      </div>

      {/* Meta Bar: Title & Publish Status */}
      <div className="p-4 rounded-xl border border-border bg-surface grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-7">
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Display Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-bold rounded-base border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Publish Status
          </label>
          <select
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-medium rounded-base border border-border bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-ink"
          >
            <option value="active">Active (Live on Website)</option>
            <option value="draft">Draft (Internal Only)</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="sm:col-span-2 text-right">
          <div className="text-[10px] uppercase font-mono text-muted">Last Updated Stamp</div>
          <div className="text-xs font-mono font-bold text-ink mt-0.5">{formattedDate}</div>
        </div>
      </div>

      {/* Version History Drawer (if opened) */}
      {isHistoryOpen && (
        <div className="p-4 rounded-xl border border-border bg-surface-elevated/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-ink" />
              <span>Revision History &amp; Restore Points</span>
            </h4>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="text-xs text-muted hover:text-ink cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="divide-y divide-border">
            {policy.versions.map((ver) => (
              <div key={ver.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">v{ver.version_number}</span>
                    <span className="text-muted font-mono">
                      {new Date(ver.created_at).toLocaleString()}
                    </span>
                    {ver.version_number === policy.versionCount && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-500 font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">
                    {ver.change_summary || 'Manual save'} • Hash: {ver.content_hash.slice(0, 8)}
                  </div>
                </div>

                {ver.version_number !== policy.versionCount && (
                  <button
                    onClick={() => handleRestoreVersion(ver)}
                    disabled={restoringVersionId === ver.id}
                    className="px-2.5 py-1 rounded-base border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WYSIWYG Toolbar */}
      <div className="sticky top-0 z-30 p-2 rounded-xl border border-border bg-surface shadow-md flex items-center gap-1 flex-wrap text-xs">
        {/* Headings */}
        <button
          type="button"
          onClick={() => handleInsertHeading('h2')}
          title="Section Header (H2)"
          className="px-2.5 py-1.5 rounded hover:bg-surface-elevated text-ink font-bold flex items-center gap-1"
        >
          <Heading2 className="w-4 h-4" />
          <span className="text-[11px]">H2</span>
        </button>

        <button
          type="button"
          onClick={() => handleInsertHeading('h3')}
          title="Sub Header (H3)"
          className="px-2.5 py-1.5 rounded hover:bg-surface-elevated text-ink font-bold flex items-center gap-1"
        >
          <Heading3 className="w-4 h-4" />
          <span className="text-[11px]">H3</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Basic formatting */}
        <button
          type="button"
          onClick={() => applyCommand('bold')}
          title="Bold"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink font-bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => applyCommand('italic')}
          title="Italic"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => applyCommand('underline')}
          title="Underline"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => applyCommand('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => applyCommand('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Link & Image to Cloudflare R2 */}
        <button
          type="button"
          onClick={handleInsertLink}
          title="Insert Link"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image (Uploads to Cloudflare R2)"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink flex items-center gap-1"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-[11px] text-muted hidden sm:inline">R2 Image</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => applyCommand('insertHorizontalRule')}
          title="Divider Line"
          className="p-1.5 rounded hover:bg-surface-elevated text-ink"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* True WYSIWYG Editable Canvas (Identical to Public Website Design) */}
      <div className="border border-border rounded-2xl bg-white text-[#1D1D1F] p-6 sm:p-14 shadow-lg">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Simulation */}
          <div className="border-b border-black/10 pb-4 flex items-center justify-between text-xs font-mono text-black/60">
            <span className="flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </span>
            <span className="flex items-center gap-1 text-black/80">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal Documentation</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter border-b-4 border-[#1D1D1F] pb-6 text-[#1D1D1F]">
            {title}
          </h1>

          <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono border-l-2 border-black pl-4">
            Last Updated: {formattedDate}
          </div>

          {/* Editable Content Area */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            suppressContentEditableWarning
            className="min-h-[420px] focus:outline-none space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg policy-editor [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
          />
        </div>
      </div>

      {/* Revision summary input before save */}
      <div className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex-1">
          <input
            type="text"
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            placeholder="Optional change note (e.g. Updated lead times to 7–10 days, adjusted return claims window)..."
            className="w-full px-3 py-2 rounded-base border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="px-5 py-2 rounded-base bg-brand hover:bg-brand/90 text-white font-semibold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <PolicyPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={title}
          slug={policy.slug}
          content={contentHtml}
          contentUpdatedAt={policy.contentUpdatedAt}
        />
      )}
    </div>
  );
}
