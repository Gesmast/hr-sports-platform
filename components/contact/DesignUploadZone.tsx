'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Box, Trash2, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { DesignFile } from '@/types';
import {
  MAX_FLAT_FILE_SIZE_BYTES,
  MAX_3D_FILE_SIZE_BYTES,
  ALLOWED_FLAT_EXTENSIONS,
  ALLOWED_3D_EXTENSIONS,
} from '@/lib/constants';

interface DesignUploadZoneProps {
  files: DesignFile[];
  onChange: (files: DesignFile[]) => void;
  error?: string;
  label?: string;
  sublabel?: string;
}

interface UploadProgressState {
  [fileName: string]: number; // 0 to 100
}

export const DesignUploadZone: React.FC<DesignUploadZoneProps> = ({
  files,
  onChange,
  error,
  label = 'Drag & drop tech packs, artwork, or logos here',
  sublabel = 'Upload vector art (.pdf, .ai, .eps, .svg) and logo images (.png, .jpg)',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const determineKind = (ext: string): 'flat' | '3d' | null => {
    const formattedExt = ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
    if (ALLOWED_FLAT_EXTENSIONS.includes(formattedExt as any)) return 'flat';
    if (ALLOWED_3D_EXTENSIONS.includes(formattedExt as any)) return '3d';
    return null;
  };

  const processFiles = async (selectedFiles: FileList | File[]) => {
    setValidationError(null);
    const newFiles: DesignFile[] = [...files];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const kind = determineKind(ext);

      if (!kind) {
        setValidationError(`Unsupported file extension (${ext}). Please provide .pdf, .ai, .eps, .png, .jpg, .svg or 3D files (.glb, .obj, .zprj).`);
        continue;
      }

      if (kind === 'flat' && file.size > MAX_FLAT_FILE_SIZE_BYTES) {
        setValidationError(`"${file.name}" exceeds the 100MB limit for flat tech packs.`);
        continue;
      }

      if (kind === '3d' && file.size > MAX_3D_FILE_SIZE_BYTES) {
        setValidationError(`"${file.name}" exceeds the 250MB limit for 3D garment files.`);
        continue;
      }

      // Check if already added
      if (newFiles.some((f) => f.fileName === file.name && f.sizeBytes === file.size)) {
        continue;
      }

      // Local preview URL via object URL
      let localBlobUrl: string | undefined = undefined;
      try {
        localBlobUrl = URL.createObjectURL(file);
      } catch (e) {
        // fallback
      }

      // Track progress
      setUploadProgress((prev) => ({ ...prev, [file.name]: 25 }));

      // Request presigned URL from Cloudflare R2
      let storageUrl = localBlobUrl || `https://storage.hrsports.com/vault/${Date.now()}-${file.name}`;
      try {
        const presignRes = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileSizeBytes: file.size,
            fileType: file.type,
            kind,
          }),
        });
        if (presignRes.ok) {
          const presignData = await presignRes.json();
          if (presignData.publicUrl) {
            storageUrl = localBlobUrl || presignData.publicUrl;
          }
        }
      } catch (err) {
        // keep local blob
      }

      const designFile: DesignFile = {
        fileName: file.name,
        sizeBytes: file.size,
        kind,
        extension: ext,
        storageUrl,
        previewUrl: localBlobUrl,
      };

      // Progress animation
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 75 }));
      }, 100);

      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      }, 250);

      newFiles.push(designFile);
    }

    onChange(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-base p-6 text-center cursor-pointer transition-all duration-150',
          isDragOver
            ? 'border-ink bg-surface'
            : 'border-border-light hover:border-ink hover:bg-surface/50 bg-white',
          (error || validationError) && 'border-red-500 bg-red-50/20'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.webp,.glb,.gltf,.obj,.fbx,.stl,.zprj,.bw,.lot"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files);
            }
          }}
        />

        <div className="w-10 h-10 rounded-base bg-surface border-hairline border-border mx-auto mb-2 flex items-center justify-center text-ink">
          <UploadCloud className="w-5 h-5 stroke-[1.5]" />
        </div>

        <div className="text-xs sm:text-sm font-extrabold text-ink tracking-tight mb-1">
          {label}, or <span className="underline">browse</span>
        </div>

        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          {sublabel}
        </p>

        {/* Explicit Per-File Type Hint Badges */}
        <div className="mt-3 pt-3 border-t border-border-light flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono">
          <span className="bg-surface px-2 py-0.5 rounded-sm border-hairline border-border-light text-ink">
            📁 Flat / Tech Pack: .PDF, .AI, .EPS, .SVG, .PNG (100MB Max)
          </span>
          <span className="bg-surface px-2 py-0.5 rounded-sm border-hairline border-border-light text-ink">
            🧊 3D / CAD: .GLB, .OBJ, .FBX, .ZPRJ (250MB Max)
          </span>
        </div>
      </div>

      {/* Errors */}
      {(validationError || error) && (
        <div className="p-3 bg-red-50 border-hairline border-red-300 rounded-base text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{validationError || error}</span>
        </div>
      )}

      {/* Attached Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-mono font-bold uppercase text-ink tracking-wider">
            Attached Assets ({files.length}):
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => {
              const progress = uploadProgress[file.fileName] || 100;
              const is3D = file.kind === '3d';
              const isImage = ['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(file.extension.toLowerCase());

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white border-hairline border-border rounded-base text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-base bg-surface border-hairline border-border-light flex items-center justify-center text-ink shrink-0 overflow-hidden">
                      {isImage && file.previewUrl ? (
                        <img src={file.previewUrl} alt={file.fileName} className="w-full h-full object-cover" />
                      ) : is3D ? (
                        <Box className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-ink truncate max-w-[200px] sm:max-w-[300px]">
                        {file.fileName}
                      </div>
                      <div className="text-[11px] font-mono text-muted flex items-center gap-2">
                        <span>{formatBytes(file.sizeBytes)}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold text-ink">{file.kind} file</span>
                        {progress < 100 && <span>• Uploading ({progress}%)</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-base transition-colors"
                      aria-label="Remove attached file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignUploadZone;
