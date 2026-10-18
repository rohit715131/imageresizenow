'use client';

import React, { useState } from 'react';
import {
  CompressPdfOptions,
  CompressionPreset,
  PdfFileState,
  PdfProcessedResult,
} from '../types';
import { compressPdf } from '../compress-pdf';
import { formatBytes } from '@/lib/utils';
import {
  FileArchive,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Loader2,
  Target,
  ShieldAlert,
} from 'lucide-react';

interface CompressPdfToolProps {
  pdfState: PdfFileState;
  onResult: (result: PdfProcessedResult) => void;
  defaultPreset?: CompressionPreset;
  defaultTargetKb?: number;
}

export function CompressPdfTool({
  pdfState,
  onResult,
  defaultPreset = 'medium',
  defaultTargetKb,
}: CompressPdfToolProps) {
  const [preset, setPreset] = useState<CompressionPreset>(
    defaultTargetKb ? 'target' : defaultPreset
  );
  const [targetKb, setTargetKb] = useState<number>(defaultTargetKb || 200);
  const [skipIfLarger, setSkipIfLarger] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targetPresets = [100, 200, 500, 1000];

  const handleCompress = async () => {
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus('Starting PDF compression...');
    setErrorMsg(null);

    try {
      const options: CompressPdfOptions = {
        preset,
        targetSizeKb: preset === 'target' ? targetKb : undefined,
        skipIfLarger,
      };

      const result = await compressPdf(pdfState, options, (pct, status) => {
        setProgressPercent(pct);
        setProgressStatus(status);
      });

      onResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compress PDF. Please try a different preset.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 transition-all">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <FileArchive className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            PDF Compression Level
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selected: <span className="font-semibold text-slate-700 dark:text-slate-200">{pdfState.name}</span> ({formatBytes(pdfState.size)}, {pdfState.pageCount} {pdfState.pageCount === 1 ? 'page' : 'pages'})
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="my-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
          Choose Compression Preset
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            {
              id: 'medium' as const,
              title: 'Medium',
              badge: 'Recommended',
              desc: 'Best balance of small size & sharp text',
            },
            {
              id: 'high' as const,
              title: 'High',
              badge: 'Smallest Size',
              desc: 'Strong compression for email/portals',
            },
            {
              id: 'low' as const,
              title: 'Low',
              badge: 'High Quality',
              desc: 'Minimal loss, ideal for printing',
            },
            {
              id: 'target' as const,
              title: 'Target Size',
              badge: 'Custom KB',
              desc: 'Aim for exact KB limit (100KB, 200KB)',
            },
          ].map((item) => {
            const isSelected = preset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreset(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/70 shadow-md shadow-blue-500/10 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`font-bold text-sm ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-snug ${
                    isSelected
                      ? 'text-blue-700 dark:text-blue-200 font-medium'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Size Mode Controls */}
      {preset === 'target' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 mb-6 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Set Target File Size
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {targetPresets.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTargetKb(size)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  targetKb === size
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {size >= 1000 ? `${size / 1000} MB` : `${size} KB`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="20"
              max="20000"
              value={targetKb}
              onChange={(e) => setTargetKb(Math.max(10, parseInt(e.target.value) || 100))}
              className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Target Kilobytes (approx. budget: ~{Math.round(targetKb / pdfState.pageCount)} KB per page)
            </span>
          </div>
        </div>
      )}

      {/* Skip if larger checkbox */}
      <div className="flex items-start gap-3 py-3 border-t border-slate-100 dark:border-slate-800">
        <input
          id="skip-if-larger"
          type="checkbox"
          checked={skipIfLarger}
          onChange={(e) => setSkipIfLarger(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded text-blue-600 accent-blue-600 cursor-pointer"
        />
        <label
          htmlFor="skip-if-larger"
          className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-relaxed"
        >
          <strong>Skip compression if output is larger:</strong> Retains your original document automatically if the PDF is already heavily optimized.
        </label>
      </div>

      {/* Flattening notice alert */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 my-4">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> In-browser compression re-renders each PDF page onto high-resolution raster layers. This safely flattens vector text into non-selectable text while maximizing file size reduction.
        </p>
      </div>

      {/* Progress status bar */}
      {isProcessing && (
        <div className="my-4 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800 dark:text-blue-300 mb-1.5">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {progressStatus}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-200/60 dark:bg-blue-900/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="my-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Action button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleCompress}
        className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-base shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Compressing PDF Pages...</span>
          </>
        ) : (
          <>
            <FileArchive className="w-5 h-5" />
            <span>Compress PDF</span>
          </>
        )}
      </button>
    </div>
  );
}
