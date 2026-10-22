'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SplitSquareVertical,
  Columns,
  Image as ImageIcon,
  Sliders,
  Move,
} from 'lucide-react';
import { ProcessedResult, ImageFileState } from '@/lib/types';
import { formatBytes, formatPercentage } from '@/lib/utils';

interface ImageQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  original: ImageFileState;
  result: ProcessedResult;
  onDownload: () => void;
  onAdjustAgain: () => void;
  downloaded?: boolean;
}

type ViewMode = 'split' | 'side-by-side' | 'single';

export function ImageQualityModal({
  isOpen,
  onClose,
  original,
  result,
  onDownload,
  onAdjustAgain,
  downloaded,
}: ImageQualityModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = fit, 1.5, 2, etc.

  const splitContainerRef = useRef<HTMLDivElement>(null);
  const diff = formatPercentage(original.size, result.size);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle split slider dragging
  const handleSplitPointerDown = (e: React.PointerEvent) => {
    setIsDraggingSplit(true);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    updateSplitFromEvent(e.clientX);
  };

  const updateSplitFromEvent = useCallback((clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(2, Math.min(98, rawPct));
    setSplitPos(clamped);
  }, []);

  const handleSplitPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSplit) return;
    updateSplitFromEvent(e.clientX);
  };

  const handleSplitPointerUp = (e: React.PointerEvent) => {
    setIsDraggingSplit(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Image Quality Inspection
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {result.extension}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {result.width} × {result.height} px • {formatBytes(result.size)}
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center rounded-xl bg-slate-800 p-1 text-xs font-semibold border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Side-by-side comparison"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'single'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Inspect result with zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zoom &amp; Pan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Split comparison slider"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 w-full overflow-hidden bg-slate-950 flex items-center justify-center p-3 select-none">
          {/* 1. SIDE-BY-SIDE MODE */}
          {viewMode === 'side-by-side' && (
            <div className="w-full h-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto p-2">
              {/* Original Panel */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-3 flex flex-col items-center justify-center overflow-hidden min-h-[260px]">
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold text-white border border-white/10 z-10">
                  Original
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={original.previewUrl}
                  alt="Original"
                  className="max-h-[380px] w-auto max-w-full object-contain rounded-lg"
                />
                <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                  {original.width} × {original.height} px • {formatBytes(original.size)}
                </div>
              </div>

              {/* Result Panel */}
              <div className="relative rounded-2xl bg-slate-900 border border-blue-500/40 p-3 flex flex-col items-center justify-center overflow-hidden min-h-[260px]">
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-600 backdrop-blur-md text-xs font-bold text-white z-10">
                  Result
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Result"
                  className="max-h-[380px] w-auto max-w-full object-contain rounded-lg"
                />
                <div className="mt-3 text-center text-xs text-blue-400 font-mono font-bold">
                  {result.width} × {result.height} px • {formatBytes(result.size)} ({diff.text})
                </div>
              </div>
            </div>
          )}

          {/* 2. SINGLE ZOOM & PAN MODE */}
          {viewMode === 'single' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Zoom Controls floating toolbar */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-1 text-xs font-mono font-bold rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="100% Native Pixels"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, Number((z + 0.25).toFixed(2))))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Processed Result Full Quality"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease',
                  }}
                  className="max-h-[500px] w-auto max-w-full object-contain pointer-events-auto"
                />
              </div>

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-400 font-mono">
                Actual Size: {result.width} × {result.height} px • {formatBytes(result.size)}
              </div>
            </div>
          )}

          {/* 3. SPLIT COMPARISON SLIDER MODE */}
          {viewMode === 'split' && (
            <div
              ref={splitContainerRef}
              onPointerDown={handleSplitPointerDown}
              onPointerMove={handleSplitPointerMove}
              onPointerUp={handleSplitPointerUp}
              className="relative w-full h-full max-w-4xl max-h-[580px] rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center cursor-ew-resize touch-none select-none"
            >
              {/* Processed Result (Background image) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Processed Result"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Original Image (Clipped layer on the left) */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={original.previewUrl}
                  alt="Original Image"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>

              {/* Divider Line & Draggable Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 pointer-events-none"
                style={{ left: `${splitPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center border-2 border-white pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                  <Sliders className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 pointer-events-none z-10">
                Original • {formatBytes(original.size)}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600/80 backdrop-blur-md text-[11px] font-bold text-white border border-blue-400/30 pointer-events-none z-10">
                Result • {formatBytes(result.size)} ({diff.text})
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none z-10 border border-white/10">
                Drag slider left &amp; right to inspect fine details
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-400">
              Original: <strong className="text-slate-200">{formatBytes(original.size)}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              New: <strong className="text-emerald-400">{formatBytes(result.size)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              {diff.text} saved
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Adjust & Resize Again */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onAdjustAgain();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Return to edit parameters"
            >
              <Sliders className="w-4 h-4" />
              <span>Adjust &amp; Resize Again</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={onDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 transition-all"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Looks Good, Download ({formatBytes(result.size)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
