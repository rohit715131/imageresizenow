'use client';

import React, { useState, useEffect } from 'react';
import {
  ImageFileState,
  ProcessedResult,
  CompressOptions,
  ImageFormat,
} from '@/lib/types';
import { compressImage } from '@/lib/image-processor';
import { formatBytes } from '@/lib/utils';
import { Target, Sliders, ArrowRight, Check, Zap } from 'lucide-react';

interface CompressToolProps {
  imageState: ImageFileState;
  onResult: (result: ProcessedResult) => void;
  defaultTargetKb?: number;
  defaultQuality?: number;
}

export function CompressTool({
  imageState,
  onResult,
  defaultTargetKb,
  defaultQuality,
}: CompressToolProps) {
  const [mode, setMode] = useState<'target-size' | 'quality'>(
    defaultTargetKb ? 'target-size' : 'target-size'
  );
  const [targetKb, setTargetKb] = useState<number>(defaultTargetKb || 100);
  const [quality, setQuality] = useState<number>(defaultQuality || 0.8);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (defaultTargetKb) {
      setTargetKb(defaultTargetKb);
      setMode('target-size');
    }
  }, [defaultTargetKb]);

  const executeCompress = async () => {
    if (mode === 'target-size' && targetKb <= 0) {
      alert('Please enter a target file size greater than 0 KB.');
      return;
    }
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = imageState.previewUrl;
      await new Promise((resolve) => {
        if (img.complete) resolve(true);
        else img.onload = () => resolve(true);
      });

      const options: CompressOptions = {
        mode,
        quality,
        targetSizeKb: targetKb,
        format,
      };

      const res = await compressImage(img, imageState, options);
      onResult(res);
    } catch (err) {
      console.error(err);
      alert('Error during image compression. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('target-size')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mode === 'target-size'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Target File Size Mode</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('quality')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mode === 'quality'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Quality Slider Mode</span>
        </button>
      </div>

      {/* Target File Size Mode */}
      {mode === 'target-size' && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Desired Maximum File Size
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {targetKb <= 0 ? '0 KB' : targetKb >= 1024 ? `${(targetKb / 1024).toFixed(1)} MB` : `${targetKb} KB`}
              </span>
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                max="50000"
                value={targetKb}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setTargetKb(0);
                    return;
                  }
                  const parsed = parseInt(raw, 10);
                  setTargetKb(isNaN(parsed) ? 0 : Math.max(0, Math.min(50000, parsed)));
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="inline-flex items-center px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
                KB Max
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Popular File Limits
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: '20 KB', kb: 20, desc: 'Signatures / UPSC' },
                { label: '50 KB', kb: 50, desc: 'Exam Photos' },
                { label: '100 KB', kb: 100, desc: 'Fast Web' },
                { label: '200 KB', kb: 200, desc: 'Social Banner' },
                { label: '500 KB', kb: 500, desc: 'HD Photo' },
                { label: '1 MB', kb: 1024, desc: 'DSLR Print' },
              ].map((chip) => (
                <button
                  key={chip.kb}
                  type="button"
                  onClick={() => setTargetKb(chip.kb)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    targetKb === chip.kb
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{chip.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{chip.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              Smart Binary Search will run multiple quantization passes in milliseconds inside your browser to find the highest visual clarity strictly under {targetKb} KB.
            </span>
          </div>
        </div>
      )}

      {/* Quality Slider Mode */}
      {mode === 'quality' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Compression Quality
            </label>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {Math.round(quality * 100)}% (
              {quality >= 0.85 ? 'High Quality' : quality >= 0.6 ? 'Balanced' : 'Aggressive Compression'}
              )
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="0.98"
            step="0.02"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => setQuality(0.5)}
              className={`p-2 rounded-xl border ${
                quality === 0.5 ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Smallest Size (50%)
            </button>
            <button
              type="button"
              onClick={() => setQuality(0.75)}
              className={`p-2 rounded-xl border ${
                quality === 0.75 ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Balanced (75%)
            </button>
            <button
              type="button"
              onClick={() => setQuality(0.9)}
              className={`p-2 rounded-xl border ${
                quality === 0.9 ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              High Quality (90%)
            </button>
          </div>
        </div>
      )}

      {/* Output Format Selector */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Output Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'image/jpeg', name: 'JPG (Universal)' },
            { id: 'image/webp', name: 'WebP (Next-Gen)' },
            { id: 'image/avif', name: 'AVIF (Highest Ratio)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id as ImageFormat)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                format === f.id
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={executeCompress}
        disabled={isProcessing || (mode === 'target-size' && targetKb <= 0)}
        type="button"
        className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Optimizing and Compressing Locally...</span>
          </>
        ) : (
          <>
            <span>Compress Image Now</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
