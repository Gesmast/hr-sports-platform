'use client';

import React, { useState, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Paperclip,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Download,
  Building,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  Edit3,
  Check,
  CheckCheck,
  Plus,
  X,
  Palette,
  FolderArchive,
  ExternalLink,
  Upload
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { QuoteCard, QuoteData } from './QuoteCard';
import { EditInquiryModal } from './EditInquiryModal';
import { sendInquiryMessage, uploadInquiryAttachment } from '@/app/actions/portal';

interface AttachmentItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  storage_path: string;
  file_category?: string;
  created_at: string;
}

interface MessageItem {
  id: string;
  sender_type: 'client' | 'company' | 'staff';
  message_content: string;
  created_at: string;
  attachments?: any[];
  is_read?: boolean;
  read_at?: string | null;
  read_by_role?: string | null;
  sender?: {
    full_name?: string;
    company_name?: string;
  };
}

interface InquiryThreadProps {
  inquiry: {
    id: string;
    reference_id: string;
    garment_type: string;
    quantity: number;
    fabric_spec?: string;
    target_price?: number;
    custom_spec_notes?: string;
    pdf_url?: string;
    status: string;
    created_at: string;
    quotes?: QuoteData[];
    attachments?: AttachmentItem[];
    messages?: MessageItem[];
  };
}

export const InquiryThread: React.FC<InquiryThreadProps> = ({ inquiry }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isSending, startSendTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [presence, setPresence] = useState<{
    accounts: { online: boolean; last_seen: string | null };
    designer: { online: boolean; last_seen: string | null };
    factory: { isOpen: boolean; message: string; schedule: string };
  } | null>(null);

  // Mount detection for client-local device time formatting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Poll live staff presence & factory hours every 25 seconds
  useEffect(() => {
    let isCancelled = false;

    const fetchPresence = async () => {
      try {
        const res = await fetch('/api/presence/status');
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) setPresence(data);
        }
      } catch (e) {
        // silently fallback
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 25000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Helper functions to format time and dates in the viewer's device local timezone
  const formatMessageLocalTime = (isoString: string) => {
    if (!mounted || !isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getLocalDateKey = (isoString: string) => {
    if (!mounted || !isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toDateString();
    } catch {
      return '';
    }
  };

  const formatLocalDateDivider = (isoString: string) => {
    if (!mounted || !isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      if (isToday) return 'Today';
      if (isYesterday) return 'Yesterday';
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return '';
    }
  };

  // Generate instant local image thumbnail preview for staged files
  useEffect(() => {
    if (!selectedFile) {
      setFilePreviewUrl(null);
      return;
    }
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [selectedFile]);

  // Latest active quote
  const latestQuote = inquiry.quotes?.[0];

  // Determine inquiry lifecycle state
  const isUnderReview =
    Boolean((inquiry as any).inquiry_metadata?.under_review) ||
    (latestQuote?.status === 'superseded' && inquiry.status !== 'converted');

  const isInQuotingOrAccountsPhase = Boolean(
    latestQuote ||
    inquiry.status === 'quoted' ||
    isUnderReview
  );

  // Auto-scroll chat messages internally only (prevents the outer browser window from scrolling down)
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [inquiry.messages?.length]);

  const handleFileSelection = (file: File) => {
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      setError('File size exceeds the 30MB limit.');
      return;
    }

    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop event handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragging(false);
      dragCounterRef.current = 0;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    setError(null);

    // If file is staged, upload file directly via fast streaming endpoint
    if (selectedFile) {
      await executeFileUpload(selectedFile, message.trim());
      setSelectedFile(null);
      setMessage('');
      return;
    }

    startSendTransition(async () => {
      const res = await sendInquiryMessage(inquiry.id, message.trim());
      if (!res.success && res.error) {
        setError(res.error);
      } else {
        setMessage('');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  // Fast direct multipart streaming file upload (no base64 serialization delay)
  const executeFileUpload = async (file: File, userNote?: string) => {
    try {
      setUploadProgress(`Uploading ${file.name}...`);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      if (userNote) formData.append('note', userNote);

      const response = await fetch(`/api/inquiries/${inquiry.id}/attachments`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'File upload failed.');
      }

      startSendTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err?.message || 'File upload failed.');
    } finally {
      setUploadProgress(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
      return <ImageIcon className="w-4 h-4 text-emerald-600" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-700" />;
    }
    if (['ai', 'eps', 'psd'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-amber-600" />;
    }
    return <FileText className="w-4 h-4 text-gray-700" />;
  };

  const getStorageUrl = (path: string, fileName?: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `/api/storage/r2?key=${encodeURIComponent(path)}${fileName ? `&filename=${encodeURIComponent(fileName)}` : ''}`;
  };

  return (
    <div className="space-y-4 text-black">
      {/* ── 1. Specification Header Summary Card (NO PRICE, Direct PDF Download, Edit Specs) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3.5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                Inquiry #{inquiry.reference_id}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-zinc-100 text-black border border-gray-200">
                {inquiry.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-black tracking-tight mt-0.5">
              {inquiry.garment_type}
            </h2>
          </div>

          {/* Action Buttons: Direct Spec PDF Download & Edit Specs */}
          <div className="flex items-center gap-2">
            {/* Direct Spec PDF Download Button */}
            <a
              href={`/api/inquiries/${inquiry.id}/spec-pdf`}
              download={`Specification-${inquiry.reference_id}.pdf`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 transition shadow-2xs cursor-pointer group"
              title="Download compiled engineering spec sheet PDF"
            >
              <Download className="w-3.5 h-3.5 text-black group-hover:scale-110 transition-transform" />
              <span>Spec PDF</span>
            </a>

            {/* Edit Specs Button is ONLY available before inquiry reaches Accounts / Quotation phase */}
            {!isInQuotingOrAccountsPhase && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 transition shadow-xs cursor-pointer"
                title="Edit fabric, volume, or special requirements"
              >
                <Edit3 className="w-3.5 h-3.5 text-white" />
                <span>Edit Specs</span>
              </button>
            )}
          </div>
        </div>

        {/* Specs Details Grid: Quantity, Fabric, Submission Date (NO PRICE) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-zinc-50/70 p-2.5 rounded-xl border border-gray-200/80">
            <span className="block text-zinc-500 font-mono uppercase text-[10px] font-bold">Volume / Quantity</span>
            <span className="text-base font-black text-black mt-0.5 block">{inquiry.quantity} units</span>
          </div>
          <div className="bg-zinc-50/70 p-2.5 rounded-xl border border-gray-200/80">
            <span className="block text-zinc-500 font-mono uppercase text-[10px] font-bold">Fabric Specification</span>
            <span className="text-xs sm:text-sm font-bold text-black mt-0.5 block truncate">
              {inquiry.fabric_spec || 'Standard Factory Spec'}
            </span>
          </div>
          <div className="bg-zinc-50/70 p-2.5 rounded-xl border border-gray-200/80 col-span-2 sm:col-span-1">
            <span className="block text-zinc-500 font-mono uppercase text-[10px] font-bold">Intake Date</span>
            <span className="text-xs text-zinc-700 font-mono font-bold mt-0.5 block">
              {new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {inquiry.custom_spec_notes && (
          <div className="mt-3 p-2.5 bg-zinc-50 rounded-xl text-xs text-zinc-800 border border-gray-200/80 leading-relaxed">
            <strong className="text-black font-bold font-mono text-[11px] uppercase mr-1">Notes:</strong>
            {inquiry.custom_spec_notes}
          </div>
        )}
      </div>

      {/* ── 2. Structured Official Factory Proposal Card / Changes Under Review ── */}
      {isUnderReview ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-300 bg-amber-50/30 p-1.5 shadow-sm">
          {/* Blurred background preview of the quotation */}
          <div className="filter blur-[3.5px] opacity-40 pointer-events-none select-none">
            {latestQuote ? (
              <QuoteCard
                quote={latestQuote}
                inquiryQuantity={inquiry.quantity}
                onEditInquiry={() => setIsEditModalOpen(true)}
                isLatest={true}
              />
            ) : (
              <div className="h-44 bg-zinc-100 rounded-xl" />
            )}
          </div>

          {/* Prominent Overlay Note: Changes Under Review & Pending Quotation */}
          <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
            <div className="bg-white/95 backdrop-blur-md border border-amber-300 rounded-2xl p-5 sm:p-6 shadow-xl max-w-md w-full text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>

              <div>
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-200 mb-1.5">
                  Changes Under Review
                </span>
                <h4 className="text-base font-black text-black">
                  Pending Quotation
                </h4>
                <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed font-medium">
                  Your revised specifications ({inquiry.quantity} units, {inquiry.fabric_spec || 'Custom Fabric'}) have been submitted. Accounts is reviewing the revisions and preparing an updated formal quotation.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : latestQuote ? (
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Official Factory Proposal</span>
          </div>
          <QuoteCard
            quote={latestQuote}
            inquiryQuantity={inquiry.quantity}
            onEditInquiry={() => setIsEditModalOpen(true)}
            isLatest={true}
          />
        </div>
      ) : null}

      {/* ── 3. Inquiry Document Vault (Single-Line Compact Bar + Popup Modal) ── */}
      {inquiry.attachments && inquiry.attachments.length > 0 && (
        <div className="bg-white border border-gray-200/90 rounded-2xl py-2.5 px-4 shadow-xs flex items-center justify-between gap-3 text-black">
          {/* Left: Vault Title & Count Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <Paperclip className="w-4 h-4 text-black shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Document Vault
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 border border-gray-200 text-black">
              {inquiry.attachments.length} {inquiry.attachments.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {/* Center: Single-row Compact Preview Pills (strictly non-wrapping) */}
          <div className="hidden sm:flex items-center gap-2 overflow-hidden flex-1 justify-center max-w-md">
            {inquiry.attachments.slice(0, 2).map((att) => (
              <a
                key={att.id}
                href={getStorageUrl(att.storage_path, att.file_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-gray-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-800 transition truncate max-w-[190px]"
                title={att.file_name}
              >
                {getFileIcon(att.file_name)}
                <span className="truncate">{att.file_name}</span>
              </a>
            ))}
            {inquiry.attachments.length > 2 && (
              <span className="text-[11px] font-mono text-zinc-500 font-bold shrink-0">
                +{inquiry.attachments.length - 2} more
              </span>
            )}
          </div>

          {/* Right: Open Full Vault Popup Button */}
          <button
            type="button"
            onClick={() => setIsVaultModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-800 transition shadow-xs cursor-pointer shrink-0"
          >
            <FolderArchive className="w-3.5 h-3.5 text-white" />
            <span>Open Vault</span>
          </button>
        </div>
      )}

      {/* ── 4. WhatsApp / Instagram-Inspired Modern Chat Interface ── */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[520px]"
      >
        {/* Drag & Drop Visual Dropzone Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-150 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-dashed border-white/80 flex items-center justify-center mb-3">
              <Upload className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Drop file to stage for chat</h4>
            <p className="text-xs text-zinc-300 font-mono">
              Vector art, Tech packs, PDFs, Excel sheets, Images (up to 30MB)
            </p>
          </div>
        )}

        {/* Chat Top Bar */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-gray-300 flex items-center justify-center font-bold text-xs text-white shadow-2xs">
                {isInQuotingOrAccountsPhase ? (
                  <Building className="w-4 h-4 text-white" />
                ) : (
                  <Palette className="w-4 h-4 text-white" />
                )}
              </div>
              {((isInQuotingOrAccountsPhase ? presence?.accounts?.online : presence?.designer?.online)) ? (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              ) : presence?.factory?.isOpen ? (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
              ) : (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-zinc-400 ring-2 ring-white" />
              )}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-black leading-tight flex items-center gap-1.5 flex-wrap">
                <span>{isInQuotingOrAccountsPhase ? 'Accounts' : 'Designer'}</span>
                {((isInQuotingOrAccountsPhase ? presence?.accounts?.online : presence?.designer?.online)) ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                ) : presence?.factory?.isOpen ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200"
                    title="Factory floor is active (Mon-Sat 9 AM - 8 PM PKT)"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Away • Factory Open
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded font-bold border border-gray-200"
                    title="Factory opens Mon - Sat at 9:00 AM PKT"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    Offline (Factory: Mon-Sat 9 AM-8 PM)
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Inquiry #{inquiry.reference_id}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 font-bold hidden sm:block">
            End-to-end encrypted
          </div>
        </div>

        {/* Chat Message Scroll Area (WhatsApp wallpaper texture background) */}
        <div
          ref={chatScrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3"
          style={{
            backgroundColor: '#ECE5DD',
            backgroundImage: `radial-gradient(#CBD5E1 0.75px, transparent 0.75px), radial-gradient(#CBD5E1 0.75px, #ECE5DD 0.75px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        >
          {(!inquiry.messages || inquiry.messages.length === 0) ? (
            <div className="flex justify-center my-6">
              <div className="bg-white/90 backdrop-blur-xs border border-gray-200 px-4 py-2 rounded-xl text-xs text-zinc-600 font-mono shadow-2xs text-center">
                Inquiry opened with factory engineering queue. You can chat directly with the team here.
              </div>
            </div>
          ) : (
            inquiry.messages.map((msg, idx) => {
              const isCompany = msg.sender_type === 'company' || msg.sender_type === 'staff';
              const isAttachmentMessage = msg.message_content.startsWith('[ATTACHMENT]');
              const isSystemNotification = msg.message_content.startsWith('[') && !isAttachmentMessage;

              // Compute local date change for centered date headers
              const currentDateKey = getLocalDateKey(msg.created_at);
              const prevDateKey = idx > 0 ? getLocalDateKey(inquiry.messages![idx - 1].created_at) : null;
              const showDateDivider = currentDateKey && currentDateKey !== prevDateKey;

              // Centered system notice
              if (isSystemNotification) {
                return (
                  <React.Fragment key={msg.id}>
                    {showDateDivider && (
                      <div className="flex justify-center my-3">
                        <span className="px-3 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-gray-200/90 text-[11px] font-mono text-zinc-700 font-bold shadow-2xs uppercase tracking-wider">
                          {formatLocalDateDivider(msg.created_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-center my-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 text-[11px] font-mono text-zinc-700 shadow-2xs font-bold text-center max-w-lg">
                        {msg.message_content}
                        <span className="text-zinc-400 font-normal">
                          • {formatMessageLocalTime(msg.created_at)}
                        </span>
                      </span>
                    </div>
                  </React.Fragment>
                );
              }

              // Extract attachments for this message
              let msgAttachments: any[] = Array.isArray((msg as any).attachments) && (msg as any).attachments.length > 0
                ? (msg as any).attachments
                : [];

              // Handle attachment text / caption
              let captionText = msg.message_content;
              if (isAttachmentMessage) {
                const match = msg.message_content.match(/Uploaded file:\s*([^\s-]+)(?:\s*-\s*Note:\s*"(.*)")?/i);
                if (match) {
                  const filename = match[1]?.trim();
                  captionText = match[2]?.trim() || '';
                  if (msgAttachments.length === 0 && filename) {
                    const found = inquiry.attachments?.find((a) =>
                      a.file_name.toLowerCase().includes(filename.toLowerCase()) ||
                      filename.toLowerCase().includes(a.file_name.toLowerCase())
                    );
                    if (found) msgAttachments = [found];
                  }
                } else {
                  captionText = '';
                }
              }

              // WhatsApp / Instagram-style Message Bubble
              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-3">
                      <span className="px-3 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-gray-200/90 text-[11px] font-mono text-zinc-700 font-bold shadow-2xs uppercase tracking-wider">
                        {formatLocalDateDivider(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${isCompany ? 'justify-start' : 'justify-end'} animate-in fade-in-50 duration-150`}
                  >
                  <div
                    className={`max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl shadow-xs transition ${
                      isCompany
                        ? 'bg-white text-zinc-900 border border-gray-200/90 rounded-tl-xs'
                        : 'bg-black text-white rounded-tr-xs'
                    }`}
                  >
                    {isCompany && (
                      <div className="text-[11px] font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{isInQuotingOrAccountsPhase ? 'Accounts' : 'Designer'}</span>
                      </div>
                    )}

                    {/* WhatsApp-style Inline Media & Document Previews */}
                    {msgAttachments.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {msgAttachments.map((att: any, idx: number) => {
                          const fileName = att.file_name || att.fileName || 'document';
                          const storagePath = att.storage_path || att.storagePath || '';
                          const ext = fileName.split('.').pop()?.toLowerCase() || '';
                          const isImg = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext) || att.file_type?.startsWith('image/');

                          if (isImg && storagePath) {
                            return (
                              <div key={idx} className="overflow-hidden rounded-xl border border-black/10 bg-black/5">
                                <a
                                  href={getStorageUrl(storagePath, fileName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block relative group cursor-pointer"
                                  title="Click to view full image"
                                >
                                  <img
                                    src={getStorageUrl(storagePath, fileName)}
                                    alt={fileName}
                                    className="w-full max-h-64 object-cover rounded-xl transition duration-200 group-hover:scale-[1.01]"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="p-2 rounded-full bg-black/75 text-white backdrop-blur-xs shadow-md">
                                      <Download className="w-4 h-4 text-white" />
                                    </span>
                                  </div>
                                </a>
                              </div>
                            );
                          }

                          // Document File Card (PDF, Excel, Word, etc.)
                          return (
                            <a
                              key={idx}
                              href={getStorageUrl(storagePath, fileName)}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={fileName}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition group cursor-pointer ${
                                isCompany
                                  ? 'bg-zinc-100/90 border-gray-200 hover:bg-zinc-200/90 text-black'
                                  : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-2 rounded-lg shrink-0 ${isCompany ? 'bg-white text-black border border-gray-200' : 'bg-zinc-800 text-white'}`}>
                                  {getFileIcon(fileName)}
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-xs font-bold truncate group-hover:underline">
                                    {fileName}
                                  </span>
                                  <span className={`block text-[10px] font-mono uppercase ${isCompany ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    {ext.toUpperCase()} {att.file_size ? `• ${(att.file_size / 1024).toFixed(0)} KB` : ''}
                                  </span>
                                </div>
                              </div>
                              <div className={`p-1.5 rounded-full shrink-0 ${isCompany ? 'bg-white text-black group-hover:bg-zinc-100' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}>
                                <Download className="w-3.5 h-3.5" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Message Content or Caption */}
                    {captionText && !captionText.startsWith('[ATTACHMENT]') && (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                        {captionText}
                      </p>
                    )}

                    <div
                      className="flex items-center justify-end gap-1 mt-1 text-[10px] font-mono text-zinc-400"
                    >
                      <span>
                        {formatMessageLocalTime(msg.created_at)}
                      </span>
                      {!isCompany && (
                        msg.is_read ? (
                          <span title={`Read by HR Sports team (${msg.read_by_role === 'umair' ? 'Accounts' : msg.read_by_role === 'usman' ? 'Designer' : 'Staff'}${msg.read_at ? ' • ' + formatMessageLocalTime(msg.read_at) : ''})`}>
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] font-black shrink-0" />
                          </span>
                        ) : (
                          <span title="Delivered to HR Sports factory queue (Unread)">
                            <CheckCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        </div>

        {/* Bottom Bar: Attachment Preview (if file staged) */}
        {selectedFile && (
          <div className="bg-zinc-100 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 truncate">
              {filePreviewUrl ? (
                <img
                  src={filePreviewUrl}
                  alt={selectedFile.name}
                  className="w-10 h-10 object-cover rounded-lg border border-gray-300 shrink-0 bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-zinc-200 border border-gray-300 flex items-center justify-center shrink-0">
                  {getFileIcon(selectedFile.name)}
                </div>
              )}
              <div className="truncate">
                <div className="font-bold text-black truncate leading-tight">{selectedFile.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {(selectedFile.size / 1024).toFixed(0)} KB • Ready to send with message
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-500 hover:text-black cursor-pointer transition shrink-0 ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Error & Progress Notifications */}
        {error && (
          <div className="px-4 py-1.5 bg-red-50 border-t border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {uploadProgress && (
          <div className="px-4 py-1.5 bg-zinc-100 border-t border-gray-200 text-xs text-black flex items-center gap-2 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {/* WhatsApp-Style Chat Input Pill Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Hidden File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilePicked}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.ai,.eps,.psd,.xlsx,.xls,.csv"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="w-9 h-9 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-black flex items-center justify-center transition cursor-pointer border border-transparent hover:border-gray-200 shrink-0"
              title="Attach Tech Pack, Vector Art, Image, or Roster Excel (up to 30MB)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input Pill */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedFile ? 'Add an optional note with this file...' : 'Type a message... (Press Enter to send)'}
              disabled={isSending}
              className="flex-1 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-xs sm:text-sm text-black placeholder:text-zinc-400 px-4 py-2.5 rounded-full border border-gray-200 focus:border-black focus:outline-hidden transition shadow-2xs"
            />

            {/* Circular Black Send Button */}
            <button
              type="submit"
              disabled={isSending || (!message.trim() && !selectedFile)}
              className="w-9 h-9 rounded-full bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
              title="Send Message"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 ml-0.5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── 5. Edit Inquiry Specifications Modal (Interactive Revision) ── */}
      <EditInquiryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        inquiryId={inquiry.id}
        initialQuantity={inquiry.quantity}
        initialFabricSpec={inquiry.fabric_spec || ''}
        initialNotes={inquiry.custom_spec_notes || ''}
        initialGarmentType={inquiry.garment_type}
      />

      {/* ── 6. Full Document Vault Popup Modal ── */}
      {isVaultModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200/90 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative text-black flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-100 border border-gray-200 text-black">
                  <Paperclip className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-black tracking-tight">
                    Inquiry Document Vault
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Inquiry #{inquiry.reference_id} • {inquiry.attachments?.length || 0} production files
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVaultModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-black transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto py-3.5 space-y-2 pr-1">
              {inquiry.attachments?.map((att) => {
                const ext = att.file_name.split('.').pop()?.toUpperCase() || 'FILE';
                return (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-zinc-50/70 hover:bg-zinc-100/80 transition text-xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0 mr-3">
                      <div className="p-2 rounded-lg bg-white border border-gray-200 shrink-0">
                        {getFileIcon(att.file_name)}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-black text-xs sm:text-sm truncate">
                          {att.file_name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-zinc-500 uppercase">
                          <span className="px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800 font-bold">
                            {att.file_category?.replace('_', ' ') || ext}
                          </span>
                          {att.file_size ? (
                            <span>{(att.file_size / 1024).toFixed(0)} KB</span>
                          ) : null}
                          <span>• Added {new Date(att.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={getStorageUrl(att.storage_path, att.file_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 hover:bg-white text-zinc-800 text-[11px] font-bold transition cursor-pointer"
                        title="Open file in new tab"
                      >
                        <ExternalLink className="w-3 h-3 text-black" />
                        <span>View</span>
                      </a>
                      <a
                        href={getStorageUrl(att.storage_path, att.file_name)}
                        download={att.file_name}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-bold transition shadow-2xs cursor-pointer"
                        title="Download file directly"
                      >
                        <Download className="w-3 h-3 text-white" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                Stored in Cloudflare R2
              </span>
              <button
                type="button"
                onClick={() => setIsVaultModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
