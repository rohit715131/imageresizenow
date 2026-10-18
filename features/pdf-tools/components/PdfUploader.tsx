'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { PdfFileState } from '../types';
import { getPdfMetadata } from '../compress-pdf';
import { formatBytes } from '@/lib/utils';

interface PdfUploaderProps {
  pdfState: PdfFileState | null;
  onPdfLoaded: (state: PdfFileState | null) => void;
  title?: string;
  subtitle?: string;
}

export function PdfUploader({
  pdfState,
  onPdfLoaded,
  title = 'Upload PDF Document',
  subtitle = 'Drop your PDF here, or click to browse (100% private, zero uploads)',
}: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMsg('Please select a valid PDF file (.pdf)');
        return;
      }

      // Check max reasonable size (e.g. 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrorMsg('File is too large (>100MB). In-browser memory is limited. Please select a smaller file.');
        return;
      }

      setIsLoading(true);
      setErrorMsg(null);

      try {
        const metadata = await getPdfMetadata(file);
        onPdfLoaded(metadata);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to open PDF document. It may be corrupt or encrypted.');
      } finally {
        setIsLoading(false);
      }
    },
    [onPdfLoaded]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPdfLoaded(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Upload Dropzone */}
      {!pdfState ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all p-8 sm:p-12 text-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[0.99]'
              : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/80 dark:hover:bg-slate-900'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Reading PDF Document...</p>
              <p className="text-xs text-slate-500 mt-1">Analyzing pages and structure</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{subtitle}</p>

              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all pointer-events-none"
              >
                Choose PDF File
              </button>
            </div>
          )}
        </div>
      ) : (
        /* PDF Loaded Preview Card */
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {pdfState.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatBytes(pdfState.size)}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
                  {pdfState.pageCount} {pdfState.pageCount === 1 ? 'Page' : 'Pages'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Choose Different PDF</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}
    </div>
  );
}
