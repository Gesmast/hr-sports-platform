'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Film, Image as ImageIcon, Link2, RefreshCw } from 'lucide-react';

export interface MediaUploadFieldProps {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  mediaType?: 'video' | 'image' | 'any';
  label?: string;
  slotKey?: string;
}

export function MediaUploadField({
  name,
  value = '',
  onChange,
  mediaType = 'any',
  label,
  slotKey = 'theme_editor',
}: MediaUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isManualUrl, setIsManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo =
    mediaType === 'video' ||
    (value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov') || value.includes('video')));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotKey', slotKey);
      formData.append('uploadType', mediaType === 'video' ? 'video' : 'poster');

      // Upload directly to Cloudflare R2 via dashboard upload API
      const res = await fetch('/api/admin/website/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Failed to upload media to Cloudflare R2');
      }

      setUploadProgress(100);
      onChange(data.url);
    } catch (err: any) {
      console.error('Media upload error:', err);
      setError(err.message || 'Upload failed. Please check network and file format.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2 p-2.5 rounded-xl border border-border bg-surface-elevated/40 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-bold text-ink flex items-center gap-1.5">
          {mediaType === 'video' ? <Film className="w-3.5 h-3.5 text-sky-500" /> : <ImageIcon className="w-3.5 h-3.5 text-purple-500" />}
          <span>{label || (mediaType === 'video' ? 'Video File (Cloudflare R2)' : 'Image File (Cloudflare R2)')}</span>
        </label>
        <button
          type="button"
          onClick={() => setIsManualUrl(!isManualUrl)}
          className="text-[10px] font-mono text-muted hover:text-ink underline flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{isManualUrl ? 'Upload file' : 'Paste URL'}</span>
        </button>
      </div>

      {/* Manual URL Input mode */}
      {isManualUrl ? (
        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={mediaType === 'video' ? 'https://... or /video.mp4' : 'https://... or /image.png'}
            className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-surface text-ink focus:ring-1 focus:ring-ink"
          />
        </div>
      ) : (
        /* Direct File Upload & Preview mode */
        <div className="space-y-2">
          {value ? (
            <div className="relative rounded-lg border border-border bg-surface overflow-hidden group">
              {isVideo ? (
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <video src={value} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                </div>
              ) : (
                <div className="aspect-video bg-surface-elevated flex items-center justify-center relative overflow-hidden">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-2 flex items-center justify-between bg-surface/90 border-t border-border text-[11px]">
                <span className="font-mono text-muted truncate max-w-[200px]" title={value}>
                  {value.split('/').pop() || value}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-elevated hover:bg-border text-ink transition"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 rounded text-muted hover:text-rose-500 transition"
                    title="Remove media"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                isUploading
                  ? 'border-sky-500 bg-sky-500/5'
                  : 'border-border hover:border-ink hover:bg-surface-elevated'
              }`}
            >
              {isUploading ? (
                <div className="space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-sky-500" />
                  <div className="text-[11px] font-bold text-ink">Uploading to Cloudflare R2...</div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-6 h-6 mx-auto text-muted group-hover:text-ink" />
                  <div className="font-bold text-ink">Click or drop {mediaType === 'video' ? 'video' : 'image'} to upload</div>
                  <div className="text-[10px] text-muted font-mono">
                    {mediaType === 'video' ? 'MP4, WebM, MOV (Max 120MB)' : 'JPG, PNG, WebP (Max 15MB)'} &bull; Cloudflare R2 CDN
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp'}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
