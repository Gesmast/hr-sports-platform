'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  recipients_count: number;
  status: string;
  created_at: string;
  sent_at?: string;
}

export default function PromotionsPage() {
  const [activeSubscribers, setActiveSubscribers] = useState<number>(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [ctaLabel, setCtaLabel] = useState<string>('Shop Custom Sportswear');
  const [ctaUrl, setCtaUrl] = useState<string>('https://thehrsports.com');
  const [testEmail, setTestEmail] = useState<string>('owner@thehrsports.com');

  const [sending, setSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      if (data.success) {
        setActiveSubscribers(data.activeSubscribers);
        setCampaigns(data.campaigns);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSendTest = async () => {
    if (!title || !subject || !contentHtml || !testEmail) {
      setStatusMessage({ type: 'error', text: 'Please fill in title, subject, message, and test email.' });
      return;
    }
    setSending(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subject,
          previewText,
          contentHtml,
          callToAction: ctaUrl ? { label: ctaLabel, url: ctaUrl } : undefined,
          isTest: true,
          testEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: `Test email sent to ${testEmail}` });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to send test' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message });
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!title || !subject || !contentHtml) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (!confirm(`Are you sure you want to broadcast this promotional email from news@thehrsports.com to all ${activeSubscribers} verified subscribers?`)) {
      return;
    }

    setSending(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subject,
          previewText,
          contentHtml,
          callToAction: ctaUrl ? { label: ctaLabel, url: ctaUrl } : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        setTitle('');
        setSubject('');
        setContentHtml('');
        setPreviewText('');
        fetchCampaigns();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to broadcast' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            <Mail className="w-7 h-7 text-emerald-600" />
            Promotional Broadcasts & Newsletter
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Compose and broadcast marketing campaigns to active newsletter subscribers from <span className="font-mono text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">news@thehrsports.com</span>
          </p>
        </div>
        <button
          onClick={fetchCampaigns}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-zinc-400">Active Subscribers</div>
            <div className="text-3xl font-black text-zinc-900 mt-2">{activeSubscribers}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">Verified Double Opt-In</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-zinc-400">Campaigns Sent</div>
            <div className="text-3xl font-black text-zinc-900 mt-2">{campaigns.length}</div>
            <div className="text-xs text-zinc-500 mt-1">All time promotional broadcasts</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-zinc-400">Sending Identity</div>
            <div className="text-sm font-bold text-zinc-900 mt-2">news@thehrsports.com</div>
            <div className="text-xs text-zinc-500 mt-1">No-reply with 1-click unsubscribe</div>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Campaign Composer */}
      <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">
          Compose New Promotional Campaign
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Campaign Title</label>
            <input
              type="text"
              placeholder="e.g. 15% Off Custom Sublimated Basketball Uniforms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Email Subject Line</label>
            <input
              type="text"
              placeholder="e.g. Season Kickoff: Custom Basketball Teamwear Specials"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Preview Snippet (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Factory-direct pricing on custom sublimation teamwear for high schools and clubs."
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Email Body / Offer Details</label>
          <textarea
            rows={6}
            placeholder="Type your message, offer terms, fabric details, or bulk discounts here (supports simple paragraphs and HTML)..."
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Button Label (CTA)</label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Button Target Link (URL)</label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 w-64 bg-zinc-50"
            />
            <button
              onClick={handleSendTest}
              disabled={sending}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Send Test
            </button>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={sending || activeSubscribers === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : `Broadcast to ${activeSubscribers} Subscribers`}
          </button>
        </div>
      </div>

      {/* Past Campaigns */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">Campaign History</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-400">
            No promotional campaigns sent yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {campaigns.map((camp) => (
              <div key={camp.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50">
                <div>
                  <div className="text-sm font-bold text-zinc-900">{camp.title}</div>
                  <div className="text-xs text-zinc-500 mt-1">Subject: {camp.subject}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {new Date(camp.created_at).toLocaleDateString()} at {new Date(camp.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {camp.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{camp.recipients_count} recipients</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
