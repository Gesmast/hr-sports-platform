'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Puck, type Data, type Viewports, usePuck } from '@puckeditor/core';
import '@puckeditor/core/dist/index.css';
import { themeConfig, defaultThemeData, type ThemeComponentProps } from '@/lib/theme/puck-config';
import { ShopifySectionsOutline } from '@/lib/theme/ShopifySectionsOutline';
import { useRole } from '@/lib/auth/role-context';
import { useI18n } from '@/lib/i18n/context';
import {
  ArrowLeft,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  X,
  RotateCcw,
  History,
  Clock,
  ShieldCheck,
  Undo2,
  FileCheck2,
  Search,
} from 'lucide-react';

interface PageOption {
  id: string;
  name: string;
  path: string;
  icon: string;
  group: 'pages' | 'categories';
  description?: string;
}

const AVAILABLE_PAGES: PageOption[] = [
  // ── Core Storefront Dynamic Home Page ──
  { id: 'home', name: 'Home page', path: '/', icon: '🏠', group: 'pages', description: 'Storefront main dynamic landing page' },

  // ── Subcategory Pages (Direct Subcategory Catalogues) ──
  { id: 'cat-cricket', name: 'Cricket', path: '/custom-sportswear/cricket', icon: '🏏', group: 'categories', description: 'Matchday whites, T20 kits & training gear' },
  { id: 'cat-football', name: 'Football / Soccer', path: '/custom-sportswear/football', icon: '⚽', group: 'categories', description: 'Match jerseys, shorts & drill kits' },
  { id: 'cat-basketball', name: 'Basketball', path: '/custom-sportswear/basketball', icon: '🏀', group: 'categories', description: 'Game jerseys & open-hole mesh shorts' },
  { id: 'cat-gym', name: 'Gym & Activewear', path: '/custom-sportswear/gym-activewear', icon: '🏃', group: 'categories', description: 'Compression tops, leggings & tanks' },
  { id: 'cat-hockey', name: 'Hockey', path: '/custom-sportswear/hockey', icon: '🏒', group: 'categories', description: 'Pro sublimated ice & field hockey kits' },
  { id: 'cat-corporate', name: 'Corporate Uniforms', path: '/uniforms/corporate-uniforms', icon: '💼', group: 'categories', description: 'Executive tech polos & workwear' },
  { id: 'cat-security', name: 'Security Uniforms', path: '/uniforms/security-uniforms', icon: '🛡️', group: 'categories', description: 'Ripstop patrol shirts & tactical vests' },
  { id: 'cat-promotional', name: 'Promotional Uniforms', path: '/uniforms/promotional-uniforms', icon: '🏷️', group: 'categories', description: 'Event crew tees & exhibition polos' },
];

const PUCK_VIEWPORTS: Viewports = [
  { width: 1280, height: 'auto', label: 'Desktop (1280px)', icon: 'Monitor' },
  { width: 768, height: 'auto', label: 'Tablet (768px)', icon: 'Tablet' },
  { width: 375, height: 'auto', label: 'Mobile (375px)', icon: 'Smartphone' },
];

/* ─────────────────────────────────────────────────────────────
   STOREFRONT LIVE PREVIEW COMPONENT (Option A - Shopify Style)
   Renders inside Puck canvas, syncs live state via postMessage,
   and handles click-on-preview block selection.
   ───────────────────────────────────────────────────────────── */
function StorefrontLivePreview({ pagePath, onNavigate }: { pagePath: string; onNavigate?: (path: string) => void }) {
  const { appState, dispatch } = usePuck();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Send live Puck JSON updates to the storefront iframe
  const pushUpdateToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'PUCK_PREVIEW_UPDATE', data: appState.data },
        '*'
      );
    }
  }, [appState.data]);

  // Push update whenever Puck data changes
  useEffect(() => {
    if (iframeLoaded) {
      pushUpdateToIframe();
    }
  }, [appState.data, iframeLoaded, pushUpdateToIframe]);

  // Sync selected block highlight to storefront when Puck selection changes
  useEffect(() => {
    const selectedIndex = appState.ui.itemSelector?.index;
    const selectedItem = typeof selectedIndex === 'number' ? appState.data?.content?.[selectedIndex] : null;
    if (iframeRef.current?.contentWindow && iframeLoaded) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'PUCK_BLOCK_HIGHLIGHT',
          index: typeof selectedIndex === 'number' ? selectedIndex : null,
          componentType: selectedItem?.type || null,
        },
        '*'
      );
    }
  }, [appState.ui.itemSelector, appState.data?.content, iframeLoaded]);

  // Listen for messages from the storefront iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. Storefront mounted & ready for live preview data
      if (event.data?.type === 'STOREFRONT_PREVIEW_READY') {
        setIframeLoaded(true);
        pushUpdateToIframe();
      }
      // 2. Click-on-preview: user clicked a section inside the storefront iframe
      else if (event.data?.type === 'PUCK_BLOCK_SELECTED') {
        const { index } = event.data;
        if (typeof index === 'number') {
          // Setting itemSelector with index only (no zone) maps directly to root content items
          dispatch({
            type: 'setUi',
            ui: { itemSelector: { index } },
          });
        }
      }
      // 3. User clicked a navigation link inside the storefront preview (e.g. Header/Footer link)
      else if (event.data?.type === 'STOREFRONT_NAVIGATE') {
        const { path } = event.data;
        if (path && onNavigate) {
          onNavigate(path);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, pushUpdateToIframe, onNavigate]);

  return (
    <div className="w-full h-full min-h-[900px] relative bg-white">
      <iframe
        ref={iframeRef}
        src={`http://localhost:3000${pagePath}?preview=true`}
        className="w-full h-full min-h-[900px] border-0 select-none shadow-sm"
        title="Live Storefront Preview"
      />
    </div>
  );
}

export default function ThemeEditorPage() {
  const { currentRole } = useRole();
  const { isUrdu, isRoman } = useI18n();

  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [data, setData] = useState<Data<ThemeComponentProps>>(defaultThemeData);
  const dataRef = useRef<Data<ThemeComponentProps>>(defaultThemeData);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Version History state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);

  // Auto-dismiss status banner
  useEffect(() => {
    if (publishStatus) {
      const timer = setTimeout(() => setPublishStatus(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [publishStatus]);

  // Load theme data when page changes
  const loadThemeForPage = async (pageId: string, reset: boolean = false) => {
    try {
      setLoading(true);
      const url = `/api/admin/website/theme?page=${pageId}${reset ? '&reset=true' : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        dataRef.current = json.data;
        setData(json.data);
        if (json.updatedAt) {
          setLastSaved(new Date(json.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.error('Failed to load theme:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemeForPage(selectedPage);
  }, [selectedPage]);

  const currentPageObj = AVAILABLE_PAGES.find((p) => p.id === selectedPage) || AVAILABLE_PAGES[0];

  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState<boolean>(false);
  const pageDropdownRef = useRef<HTMLDivElement>(null);

  // Close template dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) {
        setIsPageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Stable in-preview navigation handler
  const handleInPreviewNavigate = useCallback(
    (navPath: string) => {
      const cleanPath = navPath.split('?')[0].replace(/\/$/, '') || '/';
      const match = AVAILABLE_PAGES.find(
        (p) => p.path === cleanPath || (cleanPath === '' && p.path === '/')
      );
      if (match && match.id !== selectedPage) {
        setSelectedPage(match.id);
      }
    },
    [selectedPage]
  );

  // Stable memoized overrides preventing iframe unmounts & white blank screens on keystrokes
  const puckOverrides = useMemo(
    () => ({
      drawer: function LeftSectionsDrawer() {
        return <ShopifySectionsOutline pageName={currentPageObj.name} />;
      },
      preview: function PreviewWrapper() {
        return (
          <StorefrontLivePreview
            pagePath={currentPageObj.path}
            onNavigate={handleInPreviewNavigate}
          />
        );
      },
    }),
    [currentPageObj.name, currentPageObj.path, handleInPreviewNavigate]
  );

  // Fetch Version History
  const fetchVersionHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/admin/website/theme?page=${selectedPage}&history=true`);
      const json = await res.json();
      if (json.success && Array.isArray(json.history)) {
        setHistoryList(json.history);
      }
    } catch (err) {
      console.error('Failed to load version history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    fetchVersionHistory();
  };

  // Rollback to specific historical version
  const handleRollback = async (revisionId: string) => {
    const confirmPrompt = isUrdu
      ? 'کیا آپ واقعی اس سابقہ ورژن کو بحال کرنا چاہتے ہیں؟'
      : 'Rollback to this historical revision? Your working draft will be replaced.';
    if (!window.confirm(confirmPrompt)) return;

    try {
      setIsRollingBack(revisionId);
      const res = await fetch('/api/admin/website/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: selectedPage, rollbackId: revisionId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setPublishStatus({
          type: 'success',
          message: 'Successfully rolled back to selected revision.',
        });
        setIsHistoryOpen(false);
      } else {
        throw new Error(json.error || 'Failed to rollback revision');
      }
    } catch (err: any) {
      setPublishStatus({ type: 'error', message: err.message });
    } finally {
      setIsRollingBack(null);
    }
  };

  // 1. Save Draft (saves working draft to database + history without triggering public storefront cache purge)
  const handleSaveDraft = async (newData: Data<ThemeComponentProps>) => {
    setIsSavingDraft(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/admin/website/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newData, page: selectedPage, publish: false }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to save draft');
      }

      setData(newData);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setPublishStatus({
        type: 'success',
        message: isUrdu
          ? 'ڈرافٹ کامیابی سے محفوظ ہو گیا!'
          : isRoman
          ? 'Draft save ho chuka hai! Live website par asar nahi para.'
          : 'Draft saved successfully. Live website remains untouched until published.',
      });
    } catch (err: any) {
      setPublishStatus({
        type: 'error',
        message: err.message || 'Error saving draft',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // 2. Publish Live (pushes live, purges Next.js cache via revalidatePath webhook, adds to history)
  const handlePublish = async (newData: Data<ThemeComponentProps>) => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/admin/website/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newData, page: selectedPage, publish: true }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to publish changes');
      }

      setData(newData);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setPublishStatus({
        type: 'success',
        message: isUrdu
          ? 'تمام ترامیم لائیو ویب سائٹ پر شائع ہو گئیں اور کیش اپ ڈیٹ ہو گیا!'
          : isRoman
          ? 'Live website par changes publish ho chuke hain! Storefront cache purged.'
          : 'Published live to the public website! Next.js cache revalidated instantly.',
      });
    } catch (err: any) {
      setPublishStatus({
        type: 'error',
        message: err.message || 'Error publishing theme',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset to clean baseline
  const handleResetToBaseline = async () => {
    const confirmPrompt = isUrdu
      ? 'کیا آپ واقعی اس صفحے کی سیٹنگز اصل لائیو ویب سائٹ کے مطابق ری سیٹ کرنا چاہتے ہیں؟'
      : 'Reset this page back to the exact live website starting point?';
    if (window.confirm(confirmPrompt)) {
      await loadThemeForPage(selectedPage, true);
      setPublishStatus({
        type: 'success',
        message: 'Page sections reset to clean live website baseline.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-surface text-ink flex flex-col h-screen w-screen overflow-hidden select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. SHOPIFY-STYLE FULLSCREEN TOP NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-border bg-surface-elevated/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 gap-2">
        
        {/* Left: Exit Link back to Factory Dashboard */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 rounded-xl border border-border hover:bg-surface text-muted hover:text-ink transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Exit to Factory Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">
              {isUrdu ? 'ڈیش بورڈ واپسی' : isRoman ? 'Exit to Dashboard' : 'Exit to Dashboard'}
            </span>
          </Link>
        </div>

        {/* Center: Shopify Dawn Top-Center Template Selector Dropdown */}
        <div className="relative" ref={pageDropdownRef}>
          <button
            type="button"
            onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-bold transition shadow-2xs cursor-pointer group"
          >
            <span className="text-sm">{currentPageObj.icon}</span>
            <span>{currentPageObj.name}</span>
            <span className="font-mono text-[10px] text-muted border-l border-border pl-2 hidden sm:inline">{currentPageObj.path}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${isPageDropdownOpen ? 'rotate-180 text-ink' : 'group-hover:text-ink'}`} />
          </button>

          {isPageDropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-surface border border-border rounded-2xl shadow-2xl p-2 z-50 text-ink animate-in fade-in duration-150">
              
              {/* Group 1: Storefront Core Pages */}
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-bold flex items-center justify-between">
                <span>Storefront Pages</span>
                <span className="text-[9px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">Core</span>
              </div>
              <div className="space-y-0.5 mb-2">
                {AVAILABLE_PAGES.filter(p => p.group === 'pages').map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setSelectedPage(page.id);
                      setIsPageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                      selectedPage === page.id
                        ? 'bg-ink text-surface dark:bg-white dark:text-black font-bold shadow-2xs'
                        : 'hover:bg-surface-elevated text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{page.icon}</span>
                      <span className="font-semibold">{page.name}</span>
                    </div>
                    <span className="font-mono text-[10px] opacity-60">{page.path}</span>
                  </button>
                ))}
              </div>

              {/* Group 2: Apparel Category Pages (From Header Apparel Dropdown) */}
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-bold border-t border-border pt-2 flex items-center justify-between">
                <span>Apparel Categories (Dropdown Pages)</span>
                <span className="text-[9px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">Catalog</span>
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto">
                {AVAILABLE_PAGES.filter(p => p.group === 'categories').map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setSelectedPage(page.id);
                      setIsPageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer text-left ${
                      selectedPage === page.id
                        ? 'bg-ink text-surface dark:bg-white dark:text-black font-bold shadow-2xs'
                        : 'hover:bg-surface-elevated text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{page.icon}</span>
                      <span className="font-semibold">{page.name}</span>
                    </div>
                    <span className="font-mono text-[10px] opacity-60">{page.path}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions (Baseline, History, Draft, Publish) */}
        <div className="flex items-center gap-2">
          {/* Reset to Clean Baseline */}
          <button
            type="button"
            onClick={handleResetToBaseline}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border hover:bg-surface text-muted hover:text-ink text-[11px] font-mono font-semibold transition cursor-pointer shadow-2xs"
            title="Reset this page to the clean live website starting point"
          >
            <RotateCcw className="w-3 h-3 text-amber-500" />
            <span className="hidden lg:inline">Reset</span>
          </button>

          {/* Version History Button */}
          <button
            type="button"
            onClick={handleOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-ink text-xs font-bold transition shadow-2xs cursor-pointer"
            title="View revision history and rollbacks"
          >
            <History className="w-3.5 h-3.5 text-muted" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={() => handleSaveDraft(dataRef.current)}
            disabled={isSavingDraft || isPublishing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSavingDraft ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-muted" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Publish Live Button */}
          <button
            type="button"
            onClick={() => handlePublish(dataRef.current)}
            disabled={isPublishing || isSavingDraft}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-ink text-surface dark:bg-white dark:text-black font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileCheck2 className="w-3.5 h-3.5" />
            )}
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>
        </div>
      </header>

      {/* Status Alert Banner */}
      {publishStatus && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-between shrink-0 border-b animate-in fade-in duration-150 ${
            publishStatus.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {publishStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{publishStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setPublishStatus(null)}
            className="p-0.5 hover:opacity-80 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. PUCK VIEWPORT CANVAS (Option A: Live Storefront Iframe)
          - iframe={{ enabled: true }} keeps Viewports bar active
          - overrides.preview renders the live Storefront with postMessage
          - overrides.drawer hides the left block drawer to protect layout
          - permissions lock drag/delete/insert to protect layout
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative h-[calc(100vh-56px)] overflow-hidden">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-muted">
            <RefreshCw className="w-8 h-8 animate-spin text-ink" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold">
              {isUrdu ? 'صفحہ لوڈ ہو رہا ہے...' : 'Loading Storefront Theme...'}
            </span>
          </div>
        ) : (
          <Puck
            config={themeConfig as any}
            data={data as any}
            onChange={(newData: any) => {
              dataRef.current = newData;
            }}
            onPublish={() => handlePublish(dataRef.current)}
            headerPath=""
            iframe={{ enabled: true, waitForStyles: false, syncHostStyles: false }}
            viewports={PUCK_VIEWPORTS}
            permissions={{
              drag: false,
              duplicate: false,
              delete: false,
              insert: false,
              edit: true,
            }}
            overrides={puckOverrides}
            ui={{
              viewports: {
                current: { width: 1280, height: 'auto' },
                controlsVisible: true,
                options: PUCK_VIEWPORTS,
              },
            }}
          />
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. VERSION HISTORY & ROLLBACK SLIDE-OVER DRAWER
          ───────────────────────────────────────────────────────────── */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsHistoryOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col h-full">
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-ink" />
                  <h3 className="font-bold text-sm text-ink">Version History &amp; Rollback</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-ink transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingHistory ? (
                  <div className="py-20 text-center text-muted text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-ink" />
                    <span>Loading revisions...</span>
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="py-20 text-center text-muted text-xs space-y-1">
                    <History className="w-8 h-8 mx-auto opacity-40 mb-2" />
                    <p className="font-bold text-ink">No historical revisions yet</p>
                    <p>Revisions are created automatically each time you Save Draft or Publish Live.</p>
                  </div>
                ) : (
                  historyList.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="p-3.5 rounded-xl border border-border bg-surface-elevated/50 hover:bg-surface-elevated transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            rev.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                              : rev.status === 'rollback'
                              ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                              : 'bg-zinc-500/15 text-zinc-600 border border-zinc-500/30'
                          }`}
                        >
                          {rev.status || 'Revision'}
                        </span>
                        <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(rev.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {rev.note && <p className="text-[11px] text-muted italic">{rev.note}</p>}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-muted">
                          {rev.data?.content?.length || 0} sections configured
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRollback(rev.id)}
                          disabled={isRollingBack === rev.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-ink hover:text-surface text-[11px] font-bold text-ink transition shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                          {isRollingBack === rev.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Undo2 className="w-3 h-3" />
                          )}
                          <span>Restore</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
