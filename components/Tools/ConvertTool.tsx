'use client';

import React, { useState, useEffect } from 'react';
import {
  ImageFileState,
  ProcessedResult,
  ConvertOptions,
  ImageFormat,
} from '@/lib/types';
import { convertImage } from '@/lib/image-processor';
import { ArrowRight, RefreshCw, Layers, Check } from 'lucide-react';

interface ConvertToolProps {
  imageState: ImageFileState;
  onResult: (result: ProcessedResult) => void;
  defaultTargetFormat?: string;
}

export function ConvertTool({
  imageState,
  onResult,
  defaultTargetFormat,
}: ConvertToolProps) {
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(0.9);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (defaultTargetFormat) {
      if (defaultTargetFormat === 'image/jpeg' || defaultTargetFormat === 'jpg') {
        setTargetFormat('image/jpeg');
      } else if (defaultTargetFormat === 'image/png' || defaultTargetFormat === 'png') {
        setTargetFormat('image/png');
      } else if (defaultTargetFormat === 'image/webp' || defaultTargetFormat === 'webp') {
        setTargetFormat('image/webp');
      } else if (defaultTargetFormat === 'image/avif' || defaultTargetFormat === 'avif') {
        setTargetFormat('image/avif');
      }
    } else {
      // Default to WebP unless already WebP, then JPG
      if (imageState.type === 'image/webp') {
        setTargetFormat('image/png');
      } else {
        setTargetFormat('image/webp');
      }
    }
  }, [defaultTargetFormat, imageState.type]);

  const executeConvert = async () => {
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = imageState.previewUrl;
      await new Promise((resolve) => {
        if (img.complete) resolve(true);
        else img.onload = () => resolve(true);
      });

      const options: ConvertOptions = {
        targetFormat,
        quality,
        backgroundColor: bgColor,
      };

      const res = await convertImage(img, imageState, options);
      onResult(res);
    } catch (err) {
      console.error(err);
      alert('Error converting image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formats: { id: ImageFormat; label: string; desc: string }[] = [
    { id: 'image/webp', label: 'WebP', desc: 'Google next-gen format, 30% smaller, supports transparency' },
    { id: 'image/jpeg', label: 'JPG / JPEG', desc: 'Universally supported on every device, ideal for photos' },
    { id: 'image/png', label: 'PNG', desc: 'Lossless quality with full transparent alpha channels' },
    { id: 'image/avif', label: 'AVIF', desc: 'Cutting-edge AV1 codec, ultra-efficient compression' },
  ];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Format Selection Cards */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Select Target Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map((f) => {
            const isSelected = targetFormat === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setTargetFormat(f.id)}
                className={`p-3.5 text-left rounded-xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {f.label}
                    </span>
                    {imageState.type === f.id && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background color replacement for non-transparent target (JPG) */}
      {targetFormat === 'image/jpeg' && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Background Fill (for Transparent PNGs)</span>
            </label>
            <span className="text-xs font-mono font-medium text-slate-500">{bgColor}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            JPG does not support transparency. Choose what color replaces transparent pixels:
          </p>
          <div className="flex items-center gap-2 pt-1">
            {[
              { label: 'White', color: '#FFFFFF' },
              { label: 'Black', color: '#000000' },
              { label: 'Gray', color: '#F3F4F6' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setBgColor(c.color)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                  bgColor === c.color
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.label}</span>
              </button>
            ))}
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent"
              title="Custom Hex Color"
            />
          </div>
        </div>
      )}

      {/* Quality Slider (for non-PNG formats) */}
      {targetFormat !== 'image/png' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Compression Quality
            </label>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1.0"
            step="0.02"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={executeConvert}
        disabled={isProcessing}
        type="button"
        className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Converting Format Locally...</span>
          </>
        ) : (
          <>
            <span>Convert to {targetFormat.split('/')[1]?.toUpperCase()}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
