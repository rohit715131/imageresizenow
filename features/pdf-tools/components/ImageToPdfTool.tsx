'use client';

import React, { useState } from 'react';
import { ImageFileState } from '@/lib/types';
import {
  ImageToPdfOptions,
  PageSizeOption,
  PageOrientationOption,
  PageMarginOption,
  PdfProcessedResult,
} from '../types';
import { convertImageToPdf } from '../image-to-pdf';
import {
  FileText,
  Sliders,
  FileCheck2,
  Sparkles,
  Maximize2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ImageToPdfToolProps {
  imageState: ImageFileState;
  onResult: (result: PdfProcessedResult) => void;
  defaultPageSize?: PageSizeOption;
  defaultOrientation?: PageOrientationOption;
  defaultMargin?: PageMarginOption;
}

export function ImageToPdfTool({
  imageState,
  onResult,
  defaultPageSize = 'a4',
  defaultOrientation = 'auto',
  defaultMargin = 'small',
}: ImageToPdfToolProps) {
  const [pageSize, setPageSize] = useState<PageSizeOption>(defaultPageSize);
  const [orientation, setOrientation] = useState<PageOrientationOption>(defaultOrientation);
  const [margin, setMargin] = useState<PageMarginOption>(defaultMargin);
  const [quality, setQuality] = useState<number>(0.92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async () => {
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus('Starting conversion...');
    setErrorMsg(null);

    try {
      const options: ImageToPdfOptions = {
        pageSize,
        orientation,
        margin,
        quality,
      };

      const result = await convertImageToPdf(imageState, options, (pct, status) => {
        setProgressPercent(pct);
        setProgressStatus(status);
      });

      onResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to convert image to PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 transition-all">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            PDF Document Settings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure paper format, orientation, margins and quality
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* 1. Page Size */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            {(
              [
                { id: 'a4', label: 'A4' },
                { id: 'letter', label: 'Letter' },
                { id: 'fit', label: 'Fit Image' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPageSize(item.id)}
                className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                  pageSize === item.id
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 mt-1.5 block">
            {pageSize === 'a4' && 'Standard international A4 (210 × 297 mm)'}
            {pageSize === 'letter' && 'North American Letter (8.5 × 11 in)'}
            {pageSize === 'fit' && 'Exact canvas dimensions matching image'}
          </span>
        </div>

        {/* 2. Orientation */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Orientation
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            {(
              [
                { id: 'auto', label: 'Auto' },
                { id: 'portrait', label: 'Portrait' },
                { id: 'landscape', label: 'Landscape' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={pageSize === 'fit'}
                onClick={() => setOrientation(item.id)}
                className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                  pageSize === 'fit' ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  orientation === item.id && pageSize !== 'fit'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 mt-1.5 block">
            {pageSize === 'fit'
              ? 'Orientation is automatically determined by image'
              : orientation === 'auto'
              ? 'Automatically matches photo aspect ratio'
              : `Forced ${orientation} layout`}
          </span>
        </div>

        {/* 3. Margins */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Margins
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            {(
              [
                { id: 'none', label: 'None' },
                { id: 'small', label: 'Small' },
                { id: 'big', label: 'Big' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={pageSize === 'fit'}
                onClick={() => setMargin(item.id)}
                className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                  pageSize === 'fit' ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  margin === item.id && pageSize !== 'fit'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 mt-1.5 block">
            {pageSize === 'fit' ? 'Zero margins (Full bleed)' : margin === 'none' ? '0 margin (edge to edge)' : margin === 'small' ? '0.25 inch borders' : '0.5 inch borders'}
          </span>
        </div>
      </div>

      {/* Quality Slider */}
      <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Image Quality in PDF: {Math.round(quality * 100)}%
          </label>
          <span className="text-xs text-slate-400">
            {quality >= 0.9 ? 'Maximum Clarity' : quality >= 0.75 ? 'Balanced Size' : 'Compact File'}
          </span>
        </div>
        <input
          type="range"
          min="0.4"
          max="1.0"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Progress Bar when converting */}
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

      {/* Error Message */}
      {errorMsg && (
        <div className="my-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Convert Action Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleConvert}
        className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-base shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <FileCheck2 className="w-5 h-5" />
            <span>Convert to PDF</span>
          </>
        )}
      </button>
    </div>
  );
}
