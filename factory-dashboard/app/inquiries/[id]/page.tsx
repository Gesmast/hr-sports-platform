'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import { SlaTimerBadge } from '@/components/shared/SlaTimerBadge';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  DollarSign,
  Palette,
  Receipt,
  User,
  ShieldCheck,
  X,
  ExternalLink,
  Loader2,
  FolderOpen,
  ChevronRight,
  PlusCircle,
  FileCheck
} from 'lucide-react';

export default function InquiryWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, isUrdu } = useI18n();
  const { currentRole, currentUser } = useRole();

  // Perspective state
  const [activeRole, setActiveRole] = useState<'designer' | 'accounts' | 'coordinator' | 'owner'>(() => {
    if (currentRole === 'owner') return 'owner';
    if (currentRole === 'umair') return 'accounts';
    if (currentRole === 'hamza') return 'coordinator';
    return 'designer';
  });

  useEffect(() => {
    if (currentRole === 'owner') setActiveRole('owner');
    else if (currentRole === 'umair') setActiveRole('accounts');
    else if (currentRole === 'hamza') setActiveRole('coordinator');
    else if (currentRole === 'usman') setActiveRole('designer');
  }, [currentRole]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inquiry state populated from real database
  const [inquiry, setInquiry] = useState<any>({
    id,
    ref: id,
    party: 'Loading client details...',
    club: 'Loading spec...',
    garment: 'Garment Specification',
    qty: 0,
    targetPrice: '$18.50',
    status: 'in_design',
    createdAt: new Date().toISOString(),
    isFirstResponseMet: false,
    clientApprovalUnlocked: false,
    designerHandoverNotes: '',
    assignedDesigner: 'Usman',
    assignedAccounts: 'Umair',
    attachments: [],
    messages: [],
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [designerNotes, setDesignerNotes] = useState('');
  const [quotationAmount, setQuotationAmount] = useState('21.50');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showSpecChangeAlert, setShowSpecChangeAlert] = useState(false);
  const [specChangeDetails, setSpecChangeDetails] = useState<string | null>(null);

  // Attachment / Vault & Lightbox states
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Helper: Client device local time formatting
  const formatLocalTime = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  // Helper: WhatsApp date group chip
  const getDateGroup = (isoString?: string): string => {
    if (!isoString) return 'Today';
    try {
      const d = new Date(isoString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === today.toDateString()) return 'Today';
      if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Today';
    }
  };

  // Helper: File icon & type
  const isImageFile = (fileName?: string, mime?: string): boolean => {
    if (mime?.startsWith('image/')) return true;
    if (!fileName) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName);
  };

  const getFileIcon = (fileName?: string, mime?: string) => {
    if (isImageFile(fileName, mime)) return <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (mime?.includes('sheet') || mime?.includes('excel') || fileName?.match(/\.(xlsx|xls|csv)$/i)) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
  };

  const getStorageUrl = (path?: string, fileName?: string): string => {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/api/storage/r2?key=${encodeURIComponent(path)}${fileName ? `&filename=${encodeURIComponent(fileName)}` : ''}`;
  };

  // Load inquiry data & mark messages as read
  useEffect(() => {
    async function loadRealInquiry() {
      try {
        setLoading(true);
        const res = await fetch(`/api/data/inquiries/${id}`);
        if (!res.ok) {
          setErrorMsg(`Inquiry or CAD spec #${id} could not be loaded.`);
          return;
        }
        const data = await res.json();
        if (data.success && data.inquiry) {
          const inq = data.inquiry;
          setInquiry(inq);
          setDesignerNotes(inq.designerHandoverNotes || inq.customNotes || '');
          setMessages(inq.messages || []);

          // Check if customer updated specifications
          const meta = inq.inquiry_metadata || {};
          if (meta.client_spec_changed || inq.client_spec_changed) {
            setShowSpecChangeAlert(true);
            setSpecChangeDetails(meta.client_spec_change_summary || `Revised: ${inq.qty} units, Fabric: ${inq.fabric || 'Custom Spec'}`);
          }

          // Trigger Mark Read for Designer or Accounts (WhatsApp Blue Ticks for customer)
          if (currentRole === 'usman' || currentRole === 'umair') {
            fetch(`/api/inquiries/${id}/mark-read`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ staffId: currentUser.id, role: currentRole }),
            }).catch(() => {});
          }
        }
      } catch (err: any) {
        console.error('Failed to load inquiry workspace data:', err);
        setErrorMsg(err.message || 'Error fetching inquiry');
      } finally {
        setLoading(false);
      }
    }

    loadRealInquiry();
  }, [id, currentRole, currentUser.id]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom('auto');
    }
  }, [loading, messages.length]);

  // File Upload Handler (Drag & Drop or Picker)
  const handleFileUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('senderId', currentUser.id);

      try {
        const res = await fetch(`/api/inquiries/${id}/attachments`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.attachment) {
            // Update local attachments list
            setInquiry((prev: any) => ({
              ...prev,
              attachments: [data.attachment, ...(prev.attachments || [])],
            }));

            // Post chat message referencing this attachment
            const attachMsg = {
              id: 'm_' + Date.now(),
              sender: 'staff',
              senderName: `${currentUser.name} (${activeRole.toUpperCase()})`,
              text: `📎 Shared file: ${file.name}`,
              created_at: new Date().toISOString(),
              time: formatLocalTime(new Date().toISOString()),
              scope: activeRole === 'accounts' ? 'accounts' : 'design',
              attachments: [
                {
                  id: data.attachment.id || Date.now().toString(),
                  file_name: file.name,
                  storage_path: data.attachment.storage_path,
                  file_size_bytes: file.size,
                  mime_type: file.type,
                },
              ],
            };

            setMessages((prev) => [...prev, attachMsg]);

            // Save to DB
            await fetch(`/api/data/inquiries/${id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `📎 Shared file: ${file.name}`,
                senderType: 'staff',
                threadScope: activeRole === 'accounts' ? 'accounts' : 'design',
                senderId: currentUser.id,
                senderName: `${currentUser.name} (${activeRole})`,
              }),
            });
          }
        }
      } catch (e) {
        console.error('File upload error:', e);
      }
    }

    setStagedFiles([]);
    setIsUploading(false);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && stagedFiles.length === 0) return;

    if (stagedFiles.length > 0) {
      await handleFileUpload(stagedFiles);
    }

    if (!newMessage.trim()) return;

    const msgText = newMessage.trim();
    const newMsgObj = {
      id: 'm_' + Date.now(),
      sender: 'staff',
      senderName: `${currentUser.name} (${activeRole === 'accounts' ? 'Accounts' : activeRole === 'designer' ? 'Designer' : activeRole === 'owner' ? 'Owner' : 'Operations'})`,
      text: msgText,
      created_at: new Date().toISOString(),
      time: formatLocalTime(new Date().toISOString()),
      scope: activeRole === 'accounts' ? 'accounts' : 'design',
      is_read: false,
    };

    setMessages((prev) => [...prev, newMsgObj]);
    setNewMessage('');
    scrollToBottom();

    try {
      await fetch(`/api/data/inquiries/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msgText,
          senderType: 'staff',
          threadScope: activeRole === 'accounts' ? 'accounts' : 'design',
          senderId: currentUser.id,
          senderName: newMsgObj.senderName,
        }),
      });
      setActionNotice('Message delivered to customer portal.');
      setTimeout(() => setActionNotice(null), 4000);
    } catch {
      // safe fallback
    }
  };

  // Designer/Owner action: Unlock approval button for client
  const handleUnlockClientApproval = async () => {
    setInquiry({ ...inquiry, clientApprovalUnlocked: true });
    setActionNotice('Client Approval gate unlocked! Customer can now approve the design in their portal.');
    setTimeout(() => setActionNotice(null), 5000);

    await fetch(`/api/data/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientApprovalUnlocked: true }),
    }).catch(() => {});
  };

  // Simulate or confirm client approving design -> auto-assign to Accounts
  const handleSimulateClientApproval = async () => {
    const updatedNotes = designerNotes || 'Customer approved mockup. Tech pack & measurements locked.';
    setInquiry({
      ...inquiry,
      status: 'design_approved',
      clientApprovalUnlocked: true,
      designerHandoverNotes: updatedNotes,
      assignedAccounts: 'Muhammad Umair (accounts1)',
    });
    setActionNotice('Design Approved! Automatically assigned to Accounts for commercial quote.');
    setTimeout(() => setActionNotice(null), 6000);

    await fetch(`/api/data/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'design_approved',
        designerNotes: updatedNotes,
        clientApprovalUnlocked: true,
      }),
    }).catch(() => {});
  };

  // Accounts/Owner action: Issue formal quotation
  const handleIssueQuotation = async () => {
    setInquiry({ ...inquiry, status: 'quoted' });
    setActionNotice(`Formal Quotation ($${quotationAmount}/pc) issued with 24-hour countdown clock.`);
    setTimeout(() => setActionNotice(null), 6000);

    await fetch(`/api/data/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'quoted',
        unitPrice: `$${quotationAmount}`,
      }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-ink" />
        <p className="text-xs font-mono text-muted">Loading inquiry &amp; customer chat #{id}...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-ink">Inquiry Record Not Found</h2>
        <p className="text-xs text-muted">{errorMsg}</p>
        <Link
          href="/inquiries"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-base bg-ink text-surface text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inquiries List</span>
        </Link>
      </div>
    );
  }

  const allAttachments = inquiry.attachments || [];

  return (
    <div
      className="space-y-4 max-w-7xl mx-auto"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(Array.from(e.dataTransfer.files));
        }
      }}
    >
      {/* ── 1. Top Header Bar: Back, Reference, Party, Status, Spec PDF ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/inquiries"
            className="p-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-ink transition shrink-0"
            title="Back to Inquiries"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-ink">{inquiry.ref}</span>
              <span className="text-xs text-muted">•</span>
              <span className="text-xs font-bold text-ink">{inquiry.party}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-surface-elevated border border-border">
                {inquiry.status?.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-muted font-medium mt-0.5">
              {inquiry.garment} • <strong className="text-ink">{inquiry.qty} pcs</strong> • Target: {inquiry.targetPrice}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Action toast notice */}
          {actionNotice && (
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full animate-in fade-in">
              {actionNotice}
            </div>
          )}

          {/* Perspective Selector (Owner can switch perspectives freely) */}
          {currentRole === 'owner' && (
            <div className="flex items-center gap-1 bg-surface-elevated border border-border p-1 rounded-xl text-xs">
              <span className="text-[10px] font-mono text-muted uppercase px-1.5">View As:</span>
              {(['designer', 'accounts', 'coordinator', 'owner'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase transition ${
                    activeRole === r ? 'bg-ink text-surface shadow-2xs' : 'text-muted hover:text-ink'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Floating Document Vault (Single-Row Horizontal Preview + Full Modal) ── */}
      <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-ink" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
              Document Vault ({allAttachments.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border border-border bg-surface-elevated hover:bg-surface text-ink transition shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Document / CAD</span>
            </button>

            {allAttachments.length > 0 && (
              <button
                type="button"
                onClick={() => setIsVaultOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-ink text-surface hover:opacity-90 transition shadow-xs"
              >
                <span>Open Full Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Single-Row Horizontal Scrollable Strip (No multi-line wrapping clutter) */}
        {allAttachments.length === 0 ? (
          <div className="py-2.5 px-3 rounded-xl bg-surface-elevated border border-dashed border-border text-center text-xs text-muted font-mono">
            No files attached yet. Drag &amp; drop tech packs, CAD mockups, or pattern files.
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
            {allAttachments.map((file: any, idx: number) => {
              const isImg = isImageFile(file.file_name, file.mime_type);
              const downloadUrl = getStorageUrl(file.storage_path, file.file_name);

              return (
                <div
                  key={file.id || idx}
                  className="shrink-0 flex items-center gap-2 p-2 rounded-xl bg-surface-elevated border border-border hover:border-ink/40 transition group max-w-[220px]"
                >
                  {isImg ? (
                    <button
                      type="button"
                      onClick={() => setActiveLightboxImg({ url: downloadUrl, name: file.file_name })}
                      className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-200 border border-border shrink-0 hover:opacity-80 transition cursor-zoom-in"
                    >
                      <img src={downloadUrl} alt={file.file_name} className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border shrink-0">
                      {getFileIcon(file.file_name, file.mime_type)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-ink truncate" title={file.file_name}>
                      {file.file_name}
                    </div>
                    <div className="text-[10px] font-mono text-muted truncate">
                      {file.file_category || 'Document'}
                    </div>
                  </div>

                  <a
                    href={downloadUrl}
                    download={file.file_name}
                    className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-ink transition shrink-0"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 3. Role-Specific Action Controls Bar (Consistent for Designer & Accounts) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* DESIGNER ACTIONS (Preserved functionality: Unlock Approval, Review Notes, Confirm) */}
        {(activeRole === 'designer' || activeRole === 'owner') && (
          <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                  CAD &amp; Design Desk ({inquiry.assignedDesigner || 'Usman'})
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted uppercase">Tech Pack Gate</span>
            </div>

            <textarea
              rows={2}
              value={designerNotes}
              onChange={(e) => setDesignerNotes(e.target.value)}
              placeholder="Technical notes on pattern grading, shrinkage allowance, sublimation specs..."
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-surface-elevated text-ink placeholder:text-muted focus:outline-none focus:border-ink transition font-mono resize-none"
            />

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              {/* Unlock Client Approval Gate */}
              <button
                type="button"
                onClick={handleUnlockClientApproval}
                disabled={inquiry.clientApprovalUnlocked}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                  inquiry.clientApprovalUnlocked
                    ? 'bg-zinc-100 text-zinc-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                }`}
              >
                {inquiry.clientApprovalUnlocked ? <Check className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{inquiry.clientApprovalUnlocked ? 'Approval Gate Unlocked' : 'Unlock Client Approval'}</span>
              </button>

              {/* Confirm / Simulate Approval -> Auto assigns to accounts */}
              <button
                type="button"
                onClick={handleSimulateClientApproval}
                disabled={inquiry.status === 'design_approved' || inquiry.status === 'quoted' || inquiry.status === 'converted'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Design Approval</span>
              </button>
            </div>
          </div>
        )}

        {/* ACCOUNTS ACTIONS (Auto-assignment indicator, price calculator, 24h quote issuer) */}
        {(activeRole === 'accounts' || activeRole === 'owner') && (
          <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                  Commercials &amp; Quotations ({inquiry.assignedAccounts || 'Muhammad Umair'})
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                Auto-Assigned
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-elevated border border-border">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted font-bold">Total Batch Volume</span>
                <span className="text-sm font-black text-ink">{inquiry.qty} pcs</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono uppercase text-muted font-bold">Total Proforma Value</span>
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                  ${(Number(quotationAmount || 0) * Number(inquiry.qty || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1 bg-surface-elevated border border-border px-2.5 py-1.5 rounded-xl text-xs">
                <span className="text-muted font-mono">$</span>
                <input
                  type="text"
                  value={quotationAmount}
                  onChange={(e) => setQuotationAmount(e.target.value)}
                  className="w-16 bg-transparent text-ink font-mono font-black focus:outline-none"
                  placeholder="21.50"
                />
                <span className="text-muted font-mono">/ pc</span>
              </div>

              <button
                type="button"
                onClick={handleIssueQuotation}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 transition shadow-sm cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Issue Formal 24H Quotation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. WhatsApp-Style Real-Time Chat Workspace ── */}
      <div className="rounded-2xl border border-border bg-[#ECE5DD] dark:bg-[#121B22] overflow-hidden flex flex-col shadow-xs min-h-[500px]">
        {/* Chat Thread Header */}
        <div className="p-3.5 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink text-surface font-mono font-black text-xs flex items-center justify-center">
              {inquiry.party?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <div className="text-xs font-black text-ink flex items-center gap-1.5">
                <span>{inquiry.party}</span>
                <span className="text-[10px] text-muted font-mono font-bold">({inquiry.contactEmail || 'Client Portal'})</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Client Connected • Live Portal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>{messages.length} messages</span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[520px]">
          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-block px-4 py-2 rounded-xl bg-surface/80 backdrop-blur-xs border border-border text-xs text-muted font-mono">
                No messages yet. Send a greeting or tech-pack revision to begin communication.
              </div>
            </div>
          ) : (
            (() => {
              let lastDateGroup = '';
              return messages.map((m: any, idx: number) => {
                const isClient = m.sender === 'client';
                const dateGroup = getDateGroup(m.created_at);
                const showDateChip = dateGroup !== lastDateGroup;
                lastDateGroup = dateGroup;

                return (
                  <React.Fragment key={m.id || idx}>
                    {/* Date separator chip */}
                    {showDateChip && (
                      <div className="flex justify-center my-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-surface/90 text-muted shadow-2xs border border-border">
                          {dateGroup}
                        </span>
                      </div>
                    )}

                    {/* WhatsApp Message Bubble */}
                    <div className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}>
                      <div
                        className={`relative max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-xs text-xs space-y-1.5 ${
                          isClient
                            ? 'bg-surface text-ink rounded-tl-xs border border-border'
                            : 'bg-[#D9FDD3] dark:bg-[#005C4B] text-black dark:text-white rounded-tr-xs border border-emerald-600/20'
                        }`}
                      >
                        {/* Sender header */}
                        <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-muted pb-0.5">
                          <span className="font-bold text-ink">
                            {isClient ? inquiry.party : m.senderName || 'Staff Desk'}
                          </span>
                          {m.scope && (
                            <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 font-bold">
                              {m.scope}
                            </span>
                          )}
                        </div>

                        {/* Inline Images if present */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {m.attachments.map((att: any, aIdx: number) => {
                              const isImg = isImageFile(att.file_name, att.mime_type);
                              const downloadUrl = getStorageUrl(att.storage_path, att.file_name);

                              if (isImg) {
                                return (
                                  <div
                                    key={att.id || aIdx}
                                    className="relative rounded-xl overflow-hidden border border-border bg-black/5 group max-w-sm"
                                  >
                                    <img
                                      src={downloadUrl}
                                      alt={att.file_name}
                                      className="w-full h-auto max-h-60 object-cover cursor-zoom-in"
                                      onClick={() => setActiveLightboxImg({ url: downloadUrl, name: att.file_name })}
                                    />
                                    <div className="p-1.5 flex items-center justify-between bg-surface/90 text-[10px] font-mono">
                                      <span className="truncate">{att.file_name}</span>
                                      <a
                                        href={downloadUrl}
                                        download={att.file_name}
                                        className="p-1 rounded hover:bg-surface text-ink"
                                        title="Download Image"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <a
                                  key={att.id || aIdx}
                                  href={downloadUrl}
                                  download={att.file_name}
                                  className="flex items-center gap-2 p-2 rounded-xl bg-surface/80 border border-border hover:bg-surface transition"
                                >
                                  {getFileIcon(att.file_name, att.mime_type)}
                                  <span className="truncate text-xs font-bold text-ink flex-1">{att.file_name}</span>
                                  <Download className="w-3.5 h-3.5 text-muted shrink-0" />
                                </a>
                              );
                            })}
                          </div>
                        )}

                        {/* Text Content */}
                        {m.text && (
                          <div className="leading-relaxed whitespace-pre-wrap break-words">{m.text}</div>
                        )}

                        {/* Timestamp & Double Checkmarks */}
                        <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-muted pt-0.5">
                          <span>{m.time || formatLocalTime(m.created_at)}</span>
                          {!isClient && (
                            <span title={m.is_read ? 'Read by customer (Blue tick)' : 'Delivered to portal'}>
                              {m.is_read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                              ) : (
                                <CheckCheck className="w-3.5 h-3.5 text-muted/70" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Drag Over Active Overlay */}
        {isDragging && (
          <div className="p-4 bg-ink text-surface text-center font-mono text-xs font-bold animate-pulse">
            Drop Tech Packs, CAD Mockups, or Size Charts here to upload directly to chat!
          </div>
        )}

        {/* Staged file chips before sending */}
        {stagedFiles.length > 0 && (
          <div className="p-2.5 bg-surface border-t border-border flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono uppercase text-muted font-bold shrink-0">Staged:</span>
            {stagedFiles.map((file, sIdx) => (
              <div
                key={sIdx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-xs"
              >
                <span className="truncate max-w-[140px] font-bold text-ink">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setStagedFiles((prev) => prev.filter((_, i) => i !== sIdx))}
                  className="text-muted hover:text-rose-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chat Input Bar with Attachment Trigger */}
        <div className="p-3 bg-surface border-t border-border flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setStagedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
              }
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-muted hover:text-ink transition shrink-0 cursor-pointer"
            title="Attach CAD Mockup, Spec Sheet, or Pattern"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeRole === 'accounts'
                ? 'Type commercial update, quote details, or payment milestone note...'
                : 'Type CAD response, tech-pack revision note, or sizing answer...'
            }
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-border bg-surface-elevated text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && stagedFiles.length === 0}
            className="px-5 py-2.5 rounded-xl bg-ink text-surface hover:opacity-90 transition flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* ── 5. Full Document Vault Popup Modal ── */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-3xl max-w-2xl w-full p-6 border border-border shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-ink" />
                <h3 className="text-base font-black text-ink">Inquiry Document Vault</h3>
                <span className="text-xs font-mono text-muted">({allAttachments.length} assets)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVaultOpen(false)}
                className="p-1.5 rounded-xl border border-border hover:bg-surface-elevated text-muted hover:text-ink transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {allAttachments.map((att: any, idx: number) => {
                const downloadUrl = getStorageUrl(att.storage_path, att.file_name);
                const isImg = isImageFile(att.file_name, att.mime_type);

                return (
                  <div
                    key={att.id || idx}
                    className="p-3 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between gap-3 hover:border-ink/40 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isImg ? (
                        <img
                          src={downloadUrl}
                          alt={att.file_name}
                          className="w-10 h-10 rounded-xl object-cover border border-border cursor-pointer"
                          onClick={() => setActiveLightboxImg({ url: downloadUrl, name: att.file_name })}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center border border-border shrink-0">
                          {getFileIcon(att.file_name, att.mime_type)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-ink truncate">{att.file_name}</div>
                        <div className="text-[10px] font-mono text-muted flex items-center gap-2 mt-0.5">
                          <span>{att.file_category || 'Attachment'}</span>
                          {att.file_size_bytes && <span>• {(att.file_size_bytes / 1024).toFixed(1)} KB</span>}
                        </div>
                      </div>
                    </div>

                    <a
                      href={downloadUrl}
                      download={att.file_name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-bold transition shadow-2xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setIsVaultOpen(false)}
                className="px-5 py-2 rounded-xl bg-ink text-surface text-xs font-bold hover:opacity-90 transition"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Fullscreen Image Lightbox Modal ── */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeLightboxImg.url}
              alt={activeLightboxImg.name}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-mono text-white/80">{activeLightboxImg.name}</span>
              <a
                href={activeLightboxImg.url}
                download={activeLightboxImg.name}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveLightboxImg(null)}
                className="px-4 py-2 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Customer Specification Change Alert ── */}
      {showSpecChangeAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-500 space-y-4 text-black">
            <div className="flex items-center gap-2.5 text-amber-600 font-bold">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black text-black">Customer Changed Specifications!</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              The customer has updated the order requirements in their portal. Kindly review the updated details before finalizing CAD patterns or cutting.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-mono text-amber-900 leading-relaxed">
              <strong>Latest Customer Update:</strong>
              <div className="mt-1">{specChangeDetails}</div>
            </div>
            <button
              onClick={() => setShowSpecChangeAlert(false)}
              className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              Acknowledge &amp; Review Updated Specs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
