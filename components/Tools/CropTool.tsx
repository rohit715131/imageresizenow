'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ImageFileState,
  ProcessedResult,
  CropOptions,
  CropArea,
  ImageFormat,
} from '@/lib/types';
import { cropImage } from '@/lib/image-processor';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Crop as CropIcon,
  ArrowRight,
  Check,
} from 'lucide-react';

interface CropToolProps {
  imageState: ImageFileState;
  onResult: (result: ProcessedResult) => void;
  defaultAspectRatio?: number;
}

export function CropTool({
  imageState,
  onResult,
  defaultAspectRatio,
}: CropToolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratioMode, setRatioMode] = useState<string>(
    defaultAspectRatio ? (defaultAspectRatio === 1 ? '1:1' : 'custom') : 'free'
  );
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Crop area in native image coordinates
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: imageState.width,
    height: imageState.height,
  });

  // Calculate initial centered crop based on ratio
  const applyRatio = useCallback(
    (ratioValue: number | null) => {
      const origW = imageState.width;
      const origH = imageState.height;

      if (!ratioValue) {
        // Free: Reset to full image
        setCropArea({ x: 0, y: 0, width: origW, height: origH });
        return;
      }

      let newW = origW;
      let newH = Math.round(newW / ratioValue);

      if (newH > origH) {
        newH = origH;
        newW = Math.round(newH * ratioValue);
      }

      const x = Math.round((origW - newW) / 2);
      const y = Math.round((origH - newH) / 2);

      setCropArea({ x, y, width: newW, height: newH });
    },
    [imageState.width, imageState.height]
  );

  useEffect(() => {
    if (defaultAspectRatio) {
      applyRatio(defaultAspectRatio);
    }
  }, [defaultAspectRatio, applyRatio]);

  const ratios: { label: string; val: number | null; id: string }[] = [
    { label: 'Free', val: null, id: 'free' },
    { label: '1:1 (Square)', val: 1, id: '1:1' },
    { label: '16:9 (Widescreen)', val: 16 / 9, id: '16:9' },
    { label: '4:3 (Photo)', val: 4 / 3, id: '4:3' },
    { label: '3:2 (Camera)', val: 3 / 2, id: '3:2' },
    { label: '9:16 (Story/Reel)', val: 9 / 16, id: '9:16' },
  ];

  const handleRatioClick = (id: string, val: number | null) => {
    setRatioMode(id);
    applyRatio(val);
  };

  // Dragging interaction for crop box
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number; cropX: number; cropY: number }>({
    x: 0,
    y: 0,
    cropX: 0,
    cropY: 0,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDraggingBox(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: cropArea.x,
      cropY: cropArea.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingBox || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = imageState.width / rect.width;

    const deltaX = (e.clientX - dragStartPos.current.x) * scale;
    const deltaY = (e.clientY - dragStartPos.current.y) * scale;

    let newX = Math.round(dragStartPos.current.cropX + deltaX);
    let newY = Math.round(dragStartPos.current.cropY + deltaY);

    newX = Math.max(0, Math.min(newX, imageState.width - cropArea.width));
    newY = Math.max(0, Math.min(newY, imageState.height - cropArea.height));

    setCropArea((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDraggingBox(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const rotateCw = () => setRotation((prev) => (prev + 90) % 360);
  const rotateCcw = () => setRotation((prev) => (prev - 90 + 360) % 360);

  const executeCrop = async () => {
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = imageState.previewUrl;
      await new Promise((resolve) => {
        if (img.complete) resolve(true);
        else img.onload = () => resolve(true);
      });

      const options: CropOptions = {
        cropArea,
        format,
        quality: 0.92,
        rotation,
        flipHorizontal: flipH,
        flipVertical: flipV,
      };

      const res = await cropImage(img, imageState, options);
      onResult(res);
    } catch (err) {
      console.error(err);
      alert('Error cropping image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert crop area to percentage for visual overlay
  const cropLeftPct = (cropArea.x / imageState.width) * 100;
  const cropTopPct = (cropArea.y / imageState.height) * 100;
  const cropWidthPct = (cropArea.width / imageState.width) * 100;
  const cropHeightPct = (cropArea.height / imageState.height) * 100;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Aspect Ratio Buttons */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {ratios.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRatioClick(r.id, r.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                ratioMode === r.id
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Canvas Container */}
      <div className="relative w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 select-none">
        <div
          ref={containerRef}
          className="relative inline-block overflow-hidden touch-none"
          style={{
            transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Base image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageState.previewUrl}
            alt="Source for crop"
            className="w-full max-h-[380px] object-contain pointer-events-none block"
          />

          {/* Semi-transparent dark backdrop overlay */}
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          {/* Draggable Active Crop Box */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="absolute border-2 border-white cursor-move shadow-2xl ring-1 ring-blue-500/80 group"
            style={{
              left: `${cropLeftPct}%`,
              top: `${cropTopPct}%`,
              width: `${cropWidthPct}%`,
              height: `${cropHeightPct}%`,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Rule of thirds grid lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-white/60" />
              <div className="border-r border-white/60" />
              <div />
            </div>

            {/* Corner handle indicators */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-600 rounded-sm" />

            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white pointer-events-none">
              {cropArea.width} × {cropArea.height} px
            </div>
          </div>
        </div>
      </div>

      {/* Rotation & Flip Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Orientation:
          </span>
          <button
            type="button"
            onClick={rotateCcw}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1"
            title="Rotate 90 Counter-Clockwise"
          >
            <RotateCcw className="w-4 h-4" />
            <span>-90°</span>
          </button>
          <button
            type="button"
            onClick={rotateCw}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1"
            title="Rotate 90 Clockwise"
          >
            <RotateCw className="w-4 h-4" />
            <span>+90°</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFlipH(!flipH)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
              flipH
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>Flip H</span>
          </button>
          <button
            type="button"
            onClick={() => setFlipV(!flipV)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
              flipV
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <FlipVertical className="w-4 h-4" />
            <span>Flip V</span>
          </button>
        </div>
      </div>

      {/* Execute Button */}
      <button
        onClick={executeCrop}
        disabled={isProcessing}
        type="button"
        className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Cropping & Rendering...</span>
          </>
        ) : (
          <>
            <CropIcon className="w-5 h-5" />
            <span>Crop & Save ({cropArea.width} × {cropArea.height} px)</span>
          </>
        )}
      </button>
    </div>
  );
}
