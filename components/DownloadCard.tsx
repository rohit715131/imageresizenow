'use client';

import React, { useState } from 'react';
import {
  Download,
  Check,
  FileCheck,
  Zap,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { ProcessedResult, ImageFileState } from '@/lib/types';
import { formatBytes, formatPercentage } from '@/lib/utils';
import { ImageQualityModal } from './ImageQualityModal';

interface DownloadCardProps {
  result: ProcessedResult;
  original: ImageFileState;
  onReset: () => void;
  onAdjust?: () => void;
}

export function DownloadCard({ result, original, onReset, onAdjust }: DownloadCardProps) {
  const [customName, setCustomName] = useState(result.downloadName);
  const [downloaded, setDownloaded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const diff = formatPercentage(original.size, result.size);
  const handleAdjustAgain = onAdjust || onReset;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = customName.endsWith(`.${result.extension}`)
      ? customName
      : `${customName}.${result.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <>
      <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-emerald-500/5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base sm:text-lg">
            <FileCheck className="w-5 h-5" />
            <span>Processing Complete!</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3.5 h-3.5" />
            <span>{result.processingTimeMs} ms</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Interactive Preview image thumbnail */}
          <div
            onClick={() => setIsPreviewOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsPreviewOpen(true);
              }
            }}
            className="group relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center max-h-[300px] cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
            title="Click to preview full quality & compare"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Processed result preview"
              className="w-full h-auto max-h-[280px] object-contain p-2 group-hover:scale-[1.02] transition-transform duration-200"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm z-10">
              {result.extension.toUpperCase()} • {result.width} × {result.height}
            </div>

            {/* Click to inspect overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white backdrop-blur-[2px] p-4 text-center">
              <div className="w-11 h-11 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl border border-white/20 transform group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">
                Preview Quality &amp; Compare
              </span>
              <span className="text-[11px] text-slate-300">
                Split slider • Side-by-side • 100% Zoom
              </span>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center sm:text-left">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Original</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                  {formatBytes(original.size)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {original.width}×{original.height} px
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">New Size</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  {formatBytes(result.size)}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-semibold">
                  {diff.text} saved
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Name
              </label>
              <div className="flex rounded-xl shadow-sm">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-l-xl text-sm bg-slate-50 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-mono">
                  .{result.extension}
                </span>
              </div>
            </div>

            {/* Dedicated Preview Quality Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Preview Quality &amp; Compare (Before / After)</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            </button>

            {/* Action Buttons: Download + Adjust & Resize Again */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={handleDownload}
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 transition-all text-sm sm:text-base group"
              >
                {downloaded ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>Saved to Downloads!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Download Image ({formatBytes(result.size)})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleAdjustAgain}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs sm:text-sm"
                title="Change parameters or resize again"
              >
                <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Adjust &amp; Resize Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Inspection Modal */}
      <ImageQualityModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        original={original}
        result={result}
        onDownload={handleDownload}
        onAdjustAgain={handleAdjustAgain}
        downloaded={downloaded}
      />
    </>
  );
}
