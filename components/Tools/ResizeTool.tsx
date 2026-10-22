'use client';

import React, { useState, useEffect } from 'react';
import {
  ImageFileState,
  ProcessedResult,
  ResizeOptions,
  ImageFormat,
} from '@/lib/types';
import { resizeImage } from '@/lib/image-processor';
import { Lock, Unlock, Sliders, ArrowRight, Check } from 'lucide-react';

interface ResizeToolProps {
  imageState: ImageFileState;
  onResult: (result: ProcessedResult) => void;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function ResizeTool({
  imageState,
  onResult,
  defaultWidth,
  defaultHeight,
}: ResizeToolProps) {
  const [mode, setMode] = useState<'pixels' | 'percent' | 'preset'>('pixels');
  const [width, setWidth] = useState<number>(defaultWidth || imageState.width);
  const [height, setHeight] = useState<number>(
    defaultHeight ||
      (defaultWidth
        ? Math.round(defaultWidth / imageState.aspectRatio)
        : imageState.height)
  );
  const [percent, setPercent] = useState<number>(100);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<ImageFormat>(
    imageState.type === 'image/png' ? 'image/png' : 'image/jpeg'
  );
  const [quality, setQuality] = useState<number>(0.9);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (defaultWidth && defaultHeight) {
      setWidth(defaultWidth);
      setHeight(defaultHeight);
      setMaintainRatio(false);
    } else if (defaultWidth) {
      setWidth(defaultWidth);
      setHeight(Math.round(defaultWidth / imageState.aspectRatio));
    }
  }, [defaultWidth, defaultHeight, imageState.aspectRatio]);

  const handleWidthChange = (valStr: string) => {
    if (valStr === '') {
      setWidth(0);
      if (maintainRatio) {
        setHeight(0);
      }
      return;
    }
    const parsed = parseInt(valStr, 10);
    const num = isNaN(parsed) ? 0 : Math.min(10000, Math.max(0, parsed));
    setWidth(num);
    if (maintainRatio && imageState.aspectRatio) {
      setHeight(num === 0 ? 0 : Math.max(1, Math.round(num / imageState.aspectRatio)));
    }
  };

  const handleHeightChange = (valStr: string) => {
    if (valStr === '') {
      setHeight(0);
      if (maintainRatio) {
        setWidth(0);
      }
      return;
    }
    const parsed = parseInt(valStr, 10);
    const num = isNaN(parsed) ? 0 : Math.min(10000, Math.max(0, parsed));
    setHeight(num);
    if (maintainRatio && imageState.aspectRatio) {
      setWidth(num === 0 ? 0 : Math.max(1, Math.round(num * imageState.aspectRatio)));
    }
  };

  const handlePresetSelect = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setMaintainRatio(false);
    setMode('pixels');
  };

  const executeResize = async () => {
    if (mode === 'pixels' && (width <= 0 || height <= 0)) {
      alert('Please enter valid width and height dimensions greater than 0.');
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

      const options: ResizeOptions = {
        mode,
        width,
        height,
        percent,
        maintainAspectRatio: maintainRatio,
        format,
        quality,
      };

      const res = await resizeImage(img, imageState, options);
      onResult(res);
    } catch (err) {
      console.error(err);
      alert('Error resizing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('pixels')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'pixels'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          By Exact Pixels
        </button>
        <button
          type="button"
          onClick={() => setMode('percent')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'percent'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          By Percentage
        </button>
        <button
          type="button"
          onClick={() => setMode('preset')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'preset'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Popular Presets
        </button>
      </div>

      {/* Mode: Pixels */}
      {mode === 'pixels' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Width (px)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={width}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Height (px)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={height}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMaintainRatio(!maintainRatio)}
                className={`p-2 rounded-lg transition-colors ${
                  maintainRatio
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
                title="Toggle Aspect Ratio Lock"
              >
                {maintainRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Maintain Aspect Ratio
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {maintainRatio ? 'Linked (proportions preserved)' : 'Unlinked (freely stretch)'}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Orig: {imageState.width}×{imageState.height}
            </div>
          </div>
        </div>
      )}

      {/* Mode: Percentage */}
      {mode === 'percent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Scale Percentage
            </label>
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
              {percent}% ({Math.round(imageState.width * (percent / 100))} × {Math.round(imageState.height * (percent / 100))} px)
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={percent}
            onChange={(e) => setPercent(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            {[25, 50, 75, 100, 150, 200].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercent(pct)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  percent === pct
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode: Presets */}
      {mode === 'preset' && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select a Preset Category
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: 'Instagram Square', w: 1080, h: 1080, cat: 'Social' },
              { label: 'Instagram Story / Reel', w: 1080, h: 1920, cat: 'Social' },
              { label: 'YouTube Thumbnail', w: 1280, h: 720, cat: 'Video' },
              { label: 'Facebook / OG Share', w: 1200, h: 630, cat: 'Social' },
              { label: 'Full HD 1080p', w: 1920, h: 1080, cat: 'Display' },
              { label: 'Passport Photo 2×2"', w: 600, h: 600, cat: 'Official' },
              { label: 'Exam Form Photo', w: 200, h: 230, cat: 'Govt Form' },
              { label: 'Exam Signature', w: 140, h: 60, cat: 'Govt Form' },
              { label: 'E-commerce Thumbnail', w: 500, h: 500, cat: 'Store' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetSelect(p.w, p.h)}
                className={`p-2.5 text-left rounded-xl border transition-all ${
                  width === p.w && height === p.h
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.label}
                  </span>
                  {width === p.w && height === p.h && (
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {p.w} × {p.h} px
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Output Format and Quality */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Output Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'image/jpeg', name: 'JPG' },
              { id: 'image/png', name: 'PNG' },
              { id: 'image/webp', name: 'WebP' },
              { id: 'image/avif', name: 'AVIF' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id as ImageFormat)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
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

        {format !== 'image/png' && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quality
              </label>
              <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                {Math.round(quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Execute Button */}
      <button
        onClick={executeResize}
        disabled={isProcessing || (mode === 'pixels' && (width <= 0 || height <= 0))}
        type="button"
        className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Resizing Image in Browser...</span>
          </>
        ) : (
          <>
            <span>Resize Image Now</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
