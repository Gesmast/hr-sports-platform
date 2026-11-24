'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Settings,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
  Sliders,
  Layers,
  Send,
  HelpCircle,
} from 'lucide-react';

interface StageRule {
  enabled: boolean;
  title: string;
  desc: string;
}

interface SettingsData {
  support_email_recipient: string;
  order_stage_notification_rules: Record<string, StageRule>;
}

const DEFAULT_STAGES: Record<string, { label: string; icon: string }> = {
  cutting: { label: 'Fabric Cutting', icon: '✂️' },
  printing: { label: 'Sublimation & Printing', icon: '🖨️' },
  stitching: { label: 'Assembly & Stitching', icon: '🧵' },
  qc: { label: 'Quality Inspection', icon: '🔍' },
  dispatch: { label: 'Dispatched & Tracking', icon: '🚚' },
};

export default function WebsiteSettingsPage() {
  const { isUrdu, isRoman } = useI18n();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [supportEmail, setSupportEmail] = useState<string>('support@thehrsports.com');
  const [stageRules, setStageRules] = useState<Record<string, StageRule>>({
    cutting: { enabled: true, title: 'Fabric Cutting Underway', desc: 'Fabric has been inspected and precision-cut.' },
    printing: { enabled: true, title: 'Printing & Embroidery', desc: 'Custom graphics and embroidery are being applied.' },
    stitching: { enabled: true, title: 'Assembly & Stitching', desc: 'Panels are being assembled and stitched.' },
    qc: { enabled: true, title: 'Quality Inspection', desc: 'Garments are undergoing rigorous seam and print QC.' },
    dispatch: { enabled: true, title: 'Dispatched & Shipped', desc: 'Order packed and handed over to courier.' },
  });

  const fetchSettings = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/data/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSupportEmail(data.settings.support_email_recipient || 'support@thehrsports.com');
        if (data.settings.order_stage_notification_rules) {
          setStageRules(data.settings.order_stage_notification_rules);
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to load settings from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleStage = (key: string) => {
    setStageRules((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key]?.enabled,
      },
    }));
  };

  const handleStageFieldChange = (key: string, field: 'title' | 'desc', val: string) => {
    setStageRules((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail || !supportEmail.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid support email address.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/data/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          support_email_recipient: supportEmail,
          order_stage_notification_rules: stageRules,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setStatusMessage({
        type: 'success',
        text: 'Settings updated successfully. All changes take effect immediately.',
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider">
            <span>Website Management</span>
            <span>/</span>
            <span className="text-ink font-semibold">Email & Notifications Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted" />
            <span>
              {isUrdu
                ? 'ای میل و سسٹم سیٹنگز'
                : isRoman
                ? 'Email aur System Settings'
                : 'Email & System Settings'}
            </span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'کسٹمر سپورٹ ای میل اور آرڈر کے مراحل کے نوٹیفکیشن قواعد مرتب کریں۔'
              : isRoman
              ? 'Customer support routing aur order stage notification rules set karein.'
              : 'Configure customer service routing and customer-facing order stage email progression rules.'}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          disabled={loading || saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-surface hover:bg-surface-elevated text-ink transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Support Desk Email */}
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Mail className="w-4 h-4 text-sky-500" />
                <span>Customer Support Inbox Routing</span>
              </div>
              <p className="text-xs text-muted">
                Public website contact form submissions will be routed to this mailbox. Replies sent from here will go straight to the visitor via the automatic Reply-To header.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
              Change 3
            </span>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Support Desk Email Address
            </label>
            <div className="relative max-w-md">
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@thehrsports.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-elevated text-ink text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-ink/20"
              />
            </div>
            <p className="text-[11px] text-muted mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Standard physical Mailcow mailbox: <strong>support@thehrsports.com</strong>. The website&apos;s privacy policy, terms, and footer use this setting dynamically.
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Order Progression Email Stages */}
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>Order Manufacturing Stage Email Rules</span>
              </div>
              <p className="text-xs text-muted">
                Toggle and customize the automated updates sent from <strong>order@thehrsports.com</strong> as jobs progress on the manufacturing floor. Every email includes a visual progress bar and direct portal tracking link.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Change 5
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(DEFAULT_STAGES).map(([key, def]) => {
              const rule = stageRules[key] || { enabled: true, title: '', desc: '' };
              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border transition ${
                    rule.enabled
                      ? 'border-border bg-surface-elevated/40'
                      : 'border-border/50 bg-surface/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{def.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-ink">{def.label}</div>
                        <div className="text-[11px] font-mono text-muted uppercase">Stage Key: {key}</div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleStage(key)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600"></div>
                      <span className="ml-2 text-xs font-semibold text-ink">
                        {rule.enabled ? 'Send Email' : 'Muted'}
                      </span>
                    </label>
                  </div>

                  {rule.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/50">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                          Email Heading / Title
                        </label>
                        <input
                          type="text"
                          value={rule.title}
                          onChange={(e) => handleStageFieldChange(key, 'title', e.target.value)}
                          placeholder="e.g. Fabric Cutting Underway"
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-ink text-xs focus:ring-1 focus:ring-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-muted uppercase mb-1">
                          Customer-Facing Description
                        </label>
                        <input
                          type="text"
                          value={rule.desc}
                          onChange={(e) => handleStageFieldChange(key, 'desc', e.target.value)}
                          placeholder="e.g. Your fabric has been inspected and cut."
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-ink text-xs focus:ring-1 focus:ring-ink"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-sm font-bold hover:opacity-90 transition cursor-pointer shadow-md disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {saving
                ? isUrdu
                  ? 'محفوظ ہو رہا ہے...'
                  : isRoman
                  ? 'Save ho raha hai...'
                  : 'Saving Settings...'
                : isUrdu
                ? 'سیٹنگز محفوظ کریں'
                : isRoman
                ? 'Settings Save Karein'
                : 'Save Settings'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
