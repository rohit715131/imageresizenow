'use client';

import React from 'react';
import { PdfProcessedResult } from '../types';
import { formatBytes } from '@/lib/utils';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Zap,
  TrendingDown,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface PdfDownloadCardProps {
  result: PdfProcessedResult;
  onReset: () => void;
}

export function PdfDownloadCard({ result, onReset }: PdfDownloadCardProps) {
  const percentSaved =
    result.originalSize > 0
      ? Math.round(((result.originalSize - result.size) / result.originalSize) * 100)
      : 0;

  const isSmaller = result.size < result.originalSize;

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 transition-all">
      {/* Success Badge & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {result.skippedBecauseLarger ? 'Original Kept (Already Optimized)' : 'PDF Ready to Download!'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Processed in {result.processingTimeMs} ms • {result.pageCount} {result.pageCount === 1 ? 'Page' : 'Pages'}
            </p>
          </div>
        </div>

        {isSmaller && percentSaved > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <TrendingDown className="w-4 h-4" />
            <span>Saved {percentSaved}%</span>
          </div>
        )}
      </div>

      {/* Skipped notification if larger */}
      {result.skippedBecauseLarger && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            Your original PDF is already highly compressed. Re-compressing would have produced a larger file, so we retained your original file to prevent quality degradation.
          </p>
        </div>
      )}

      {/* Size comparison metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
            Original Size
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
            {formatBytes(result.originalSize)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
          <span className="text-[11px] uppercase tracking-wider font-bold text-blue-500 dark:text-blue-400 block mb-1">
            Result Size
          </span>
          <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
            {formatBytes(result.size)}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
            Format
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            PDF Document
          </span>
        </div>
      </div>

      {/* Flattening informational notice */}
      {result.isFlattened && (
        <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Pages flattened into optimized high-density raster layers for minimum file size.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={result.url}
          download={result.name}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF ({formatBytes(result.size)})</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Process Another</span>
        </button>
      </div>
    </div>
  );
}
