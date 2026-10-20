'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X, FileImage, ClipboardPaste } from 'lucide-react';
import { ImageFileState } from '@/lib/types';
import { getImageMetadata, createSampleImage } from '@/lib/image-processor';
import { formatBytes } from '@/lib/utils';

interface ImageUploaderProps {
  imageState: ImageFileState | null;
  onImageLoaded: (state: ImageFileState | null) => void;
  title?: string;
  subtitle?: string;
}

export function ImageUploader({
  imageState,
  onImageLoaded,
  title = 'Upload image to process',
  subtitle = 'Drop your file here, paste from clipboard (Ctrl+V), or browse',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp|avif|heic|gif|bmp)$/i)) {
        setErrorMsg('Please select a valid image file (JPG, PNG, WebP, AVIF, HEIC, etc.)');
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const metadata = await getImageMetadata(file);
        onImageLoaded(metadata);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to read image. Please try another file.');
      } finally {
        setIsLoading(false);
      }
    },
    [onImageLoaded]
  );

  // Clipboard Paste Support (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

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

  const handleLoadSample = (type: 'landscape' | 'portrait' | 'avatar') => {
    const sample = createSampleImage(type);
    handleFile(sample);
  };

  const clearImage = () => {
    if (imageState?.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    onImageLoaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (imageState) {
    return (
      <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Thumbnail preview */}
          <div className="relative group w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageState.previewUrl}
              alt={imageState.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              Active File
            </div>
          </div>

          {/* Metadata details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {imageState.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                {imageState.name}
              </h3>
            </div>

            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">Original Size</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatBytes(imageState.size)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">Dimensions</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {imageState.width} × {imageState.height} px
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">Aspect Ratio</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {imageState.aspectRatio.toFixed(2)}:1
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={clearImage}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/40 transition-colors"
              title="Remove this image and choose another"
            >
              <X className="w-4 h-4" />
              <span>Change Image</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 scale-[0.99] ring-4 ring-blue-500/20'
            : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
        } shadow-sm backdrop-blur-sm`}
      >
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 group-hover:scale-105 transition-transform">
          {isLoading ? (
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition-all"
          >
            Select Image
          </button>
          <div className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <ClipboardPaste className="w-3.5 h-3.5 text-blue-500" />
            <span>Ctrl + V to paste</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          Supports JPG, PNG, WebP, AVIF, HEIC, GIF • Processed locally in your browser
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Instant Sample Image Buttons */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> No image handy? Try a sample:
        </span>
        <button
          type="button"
          onClick={() => handleLoadSample('landscape')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <span aria-hidden="true">🌄</span> Nature (1200×800)
        </button>
        <button
          type="button"
          onClick={() => handleLoadSample('portrait')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <span aria-hidden="true">👤</span> Portrait (800×1200)
        </button>
        <button
          type="button"
          onClick={() => handleLoadSample('avatar')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <span aria-hidden="true">⭐</span> Square (600×600)
        </button>
      </div>
    </div>
  );
}
