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
  RotateCcw as ResetIcon,
  Focus,
} from 'lucide-react';

interface CropToolProps {
  imageState: ImageFileState;
  onResult: (result: ProcessedResult) => void;
  defaultAspectRatio?: number;
}

type DragMode = 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'w' | 'e' | 'draw';

export function CropTool({
  imageState,
  onResult,
  defaultAspectRatio,
}: CropToolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [ratioMode, setRatioMode] = useState<string>(
    defaultAspectRatio ? (defaultAspectRatio === 1 ? '1:1' : 'custom') : 'free'
  );
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [format, setFormat] = useState<ImageFormat>(
    imageState.type === 'image/png' ? 'image/png' : 'image/jpeg'
  );
  const [quality, setQuality] = useState<number>(0.92);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Crop area in native image coordinates
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: imageState.width,
    height: imageState.height,
  });

  const ratios: { label: string; val: number | null; id: string }[] = [
    { label: 'Free', val: null, id: 'free' },
    { label: '1:1 (Square)', val: 1, id: '1:1' },
    { label: '16:9 (Widescreen)', val: 16 / 9, id: '16:9' },
    { label: '4:3 (Photo)', val: 4 / 3, id: '4:3' },
    { label: '3:2 (Camera)', val: 3 / 2, id: '3:2' },
    { label: '9:16 (Story/Reel)', val: 9 / 16, id: '9:16' },
  ];

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

  const handleRatioClick = (id: string, val: number | null) => {
    setRatioMode(id);
    applyRatio(val);
  };

  // Center the current crop box
  const centerCropBox = () => {
    const newX = Math.max(0, Math.round((imageState.width - cropArea.width) / 2));
    const newY = Math.max(0, Math.round((imageState.height - cropArea.height) / 2));
    setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
  };

  // Reset to full image
  const resetToFull = () => {
    setRatioMode('free');
    setCropArea({
      x: 0,
      y: 0,
      width: imageState.width,
      height: imageState.height,
    });
  };

  // Manual dimension change handlers with clean 0 backspace support
  const handleManualWidth = (valStr: string) => {
    if (valStr === '') {
      setCropArea((prev) => ({ ...prev, width: 0 }));
      return;
    }
    const parsed = parseInt(valStr, 10);
    const w = isNaN(parsed) ? 0 : Math.max(0, Math.min(imageState.width, parsed));
    const targetRatio = ratios.find((r) => r.id === ratioMode)?.val || null;

    if (targetRatio && w > 0) {
      const h = Math.min(imageState.height, Math.round(w / targetRatio));
      setCropArea((prev) => ({
        ...prev,
        width: w,
        height: h,
        x: Math.min(prev.x, imageState.width - w),
        y: Math.min(prev.y, imageState.height - h),
      }));
    } else {
      setCropArea((prev) => ({
        ...prev,
        width: w,
        x: Math.min(prev.x, imageState.width - w),
      }));
    }
  };

  const handleManualHeight = (valStr: string) => {
    if (valStr === '') {
      setCropArea((prev) => ({ ...prev, height: 0 }));
      return;
    }
    const parsed = parseInt(valStr, 10);
    const h = isNaN(parsed) ? 0 : Math.max(0, Math.min(imageState.height, parsed));
    const targetRatio = ratios.find((r) => r.id === ratioMode)?.val || null;

    if (targetRatio && h > 0) {
      const w = Math.min(imageState.width, Math.round(h * targetRatio));
      setCropArea((prev) => ({
        ...prev,
        width: w,
        height: h,
        x: Math.min(prev.x, imageState.width - w),
        y: Math.min(prev.y, imageState.height - h),
      }));
    } else {
      setCropArea((prev) => ({
        ...prev,
        height: h,
        y: Math.min(prev.y, imageState.height - h),
      }));
    }
  };

  // Dragging & Resizing State
  const [activeDrag, setActiveDrag] = useState<DragMode | null>(null);
  const dragStart = useRef<{
    clientX: number;
    clientY: number;
    cropX: number;
    cropY: number;
    cropW: number;
    cropH: number;
  }>({ clientX: 0, clientY: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });

  const startDrag = (e: React.PointerEvent, mode: DragMode) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag(mode);
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      cropX: cropArea.x,
      cropY: cropArea.y,
      cropW: cropArea.width,
      cropH: cropArea.height,
    };
  };

  const updateCropFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!activeDrag || !imgRef.current) return;

      const imgWidth = imgRef.current.clientWidth || 1;
      const scale = imageState.width / imgWidth;

      const screenDx = clientX - dragStart.current.clientX;
      const screenDy = clientY - dragStart.current.clientY;

      // Inverse transform for rotation and flip to map screen delta into local image delta
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const unscaledDx = (cos * screenDx + sin * screenDy) * (flipH ? -1 : 1);
      const unscaledDy = (-sin * screenDx + cos * screenDy) * (flipV ? -1 : 1);

      const deltaX = unscaledDx * scale;
      const deltaY = unscaledDy * scale;

      const origX = dragStart.current.cropX;
      const origY = dragStart.current.cropY;
      const origW = dragStart.current.cropW;
      const origH = dragStart.current.cropH;
      const maxW = imageState.width;
      const maxH = imageState.height;
      const minSize = 20;

      // Move crop box
      if (activeDrag === 'move') {
        let newX = Math.round(origX + deltaX);
        let newY = Math.round(origY + deltaY);
        newX = Math.max(0, Math.min(newX, maxW - origW));
        newY = Math.max(0, Math.min(newY, maxH - origH));
        setCropArea({ x: newX, y: newY, width: origW, height: origH });
        return;
      }

      // Draw new crop box
      if (activeDrag === 'draw') {
        if (Math.hypot(screenDx, screenDy) < 8) return; // avoid tiny accidental clicks
        const targetRatio = ratios.find((r) => r.id === ratioMode)?.val || null;
        let w = Math.abs(deltaX);
        let h = targetRatio ? Math.round(w / targetRatio) : Math.abs(deltaY);

        w = Math.max(minSize, Math.min(maxW, w));
        h = Math.max(minSize, Math.min(maxH, h));

        let x = deltaX >= 0 ? origX : origX - w;
        let y = deltaY >= 0 ? origY : origY - h;

        x = Math.max(0, Math.min(x, maxW - w));
        y = Math.max(0, Math.min(y, maxH - h));

        setCropArea({ x, y, width: w, height: h });
        return;
      }

      const targetRatio = ratios.find((r) => r.id === ratioMode)?.val || null;

      // Free Mode: resize freely with any handle
      if (!targetRatio || ratioMode === 'free') {
        let newX = origX;
        let newY = origY;
        let newW = origW;
        let newH = origH;

        if (activeDrag.includes('e')) {
          newW = Math.max(minSize, Math.min(maxW - origX, Math.round(origW + deltaX)));
        }
        if (activeDrag.includes('s')) {
          newH = Math.max(minSize, Math.min(maxH - origY, Math.round(origH + deltaY)));
        }
        if (activeDrag.includes('w')) {
          const rightEdge = origX + origW;
          newX = Math.min(rightEdge - minSize, Math.max(0, Math.round(origX + deltaX)));
          newW = rightEdge - newX;
        }
        if (activeDrag.includes('n')) {
          const bottomEdge = origY + origH;
          newY = Math.min(bottomEdge - minSize, Math.max(0, Math.round(origY + deltaY)));
          newH = bottomEdge - newY;
        }

        setCropArea({ x: newX, y: newY, width: newW, height: newH });
        return;
      }

      // Locked Aspect Ratio Mode
      if (activeDrag === 'se') {
        let candW = origW + deltaX;
        let candH = origH + deltaY;
        let newW: number;
        let newH: number;
        if (Math.abs(deltaX) > Math.abs(deltaY * targetRatio)) {
          newW = Math.round(candW);
          newH = Math.round(newW / targetRatio);
        } else {
          newH = Math.round(candH);
          newW = Math.round(newH * targetRatio);
        }
        if (origX + newW > maxW) {
          newW = maxW - origX;
          newH = Math.round(newW / targetRatio);
        }
        if (origY + newH > maxH) {
          newH = maxH - origY;
          newW = Math.round(newH * targetRatio);
        }
        if (newW < minSize || newH < minSize) {
          if (targetRatio >= 1) {
            newH = minSize;
            newW = Math.round(minSize * targetRatio);
          } else {
            newW = minSize;
            newH = Math.round(minSize / targetRatio);
          }
        }
        setCropArea({ x: origX, y: origY, width: newW, height: newH });
        return;
      }

      if (activeDrag === 'nw') {
        const rightEdge = origX + origW;
        const bottomEdge = origY + origH;
        let candW = origW - deltaX;
        let candH = origH - deltaY;
        let newW: number;
        let newH: number;
        if (Math.abs(deltaX) > Math.abs(deltaY * targetRatio)) {
          newW = Math.round(candW);
          newH = Math.round(newW / targetRatio);
        } else {
          newH = Math.round(candH);
          newW = Math.round(newH * targetRatio);
        }
        if (rightEdge - newW < 0) {
          newW = rightEdge;
          newH = Math.round(newW / targetRatio);
        }
        if (bottomEdge - newH < 0) {
          newH = bottomEdge;
          newW = Math.round(newH * targetRatio);
        }
        if (newW < minSize || newH < minSize) {
          if (targetRatio >= 1) {
            newH = minSize;
            newW = Math.round(minSize * targetRatio);
          } else {
            newW = minSize;
            newH = Math.round(minSize / targetRatio);
          }
        }
        setCropArea({ x: rightEdge - newW, y: bottomEdge - newH, width: newW, height: newH });
        return;
      }

      if (activeDrag === 'ne') {
        const leftEdge = origX;
        const bottomEdge = origY + origH;
        let candW = origW + deltaX;
        let candH = origH - deltaY;
        let newW: number;
        let newH: number;
        if (Math.abs(deltaX) > Math.abs(deltaY * targetRatio)) {
          newW = Math.round(candW);
          newH = Math.round(newW / targetRatio);
        } else {
          newH = Math.round(candH);
          newW = Math.round(newH * targetRatio);
        }
        if (leftEdge + newW > maxW) {
          newW = maxW - leftEdge;
          newH = Math.round(newW / targetRatio);
        }
        if (bottomEdge - newH < 0) {
          newH = bottomEdge;
          newW = Math.round(newH * targetRatio);
        }
        if (newW < minSize || newH < minSize) {
          if (targetRatio >= 1) {
            newH = minSize;
            newW = Math.round(minSize * targetRatio);
          } else {
            newW = minSize;
            newH = Math.round(minSize / targetRatio);
          }
        }
        setCropArea({ x: leftEdge, y: bottomEdge - newH, width: newW, height: newH });
        return;
      }

      if (activeDrag === 'sw') {
        const rightEdge = origX + origW;
        const topEdge = origY;
        let candW = origW - deltaX;
        let candH = origH + deltaY;
        let newW: number;
        let newH: number;
        if (Math.abs(deltaX) > Math.abs(deltaY * targetRatio)) {
          newW = Math.round(candW);
          newH = Math.round(newW / targetRatio);
        } else {
          newH = Math.round(candH);
          newW = Math.round(newH * targetRatio);
        }
        if (rightEdge - newW < 0) {
          newW = rightEdge;
          newH = Math.round(newW / targetRatio);
        }
        if (topEdge + newH > maxH) {
          newH = maxH - topEdge;
          newW = Math.round(newH * targetRatio);
        }
        if (newW < minSize || newH < minSize) {
          if (targetRatio >= 1) {
            newH = minSize;
            newW = Math.round(minSize * targetRatio);
          } else {
            newW = minSize;
            newH = Math.round(minSize / targetRatio);
          }
        }
        setCropArea({ x: rightEdge - newW, y: topEdge, width: newW, height: newH });
        return;
      }

      // Edge handles in ratio mode: expand/shrink proportionally
      if (activeDrag === 'e' || activeDrag === 'w') {
        let newW = Math.round(origW + (activeDrag === 'e' ? deltaX : -deltaX));
        let newH = Math.round(newW / targetRatio);
        let newX = activeDrag === 'e' ? origX : origX + origW - newW;
        let newY = Math.round(origY - (newH - origH) / 2);

        if (newX < 0) { newW += newX; newX = 0; newH = Math.round(newW / targetRatio); }
        if (newX + newW > maxW) { newW = maxW - newX; newH = Math.round(newW / targetRatio); }
        if (newY < 0) { newY = 0; }
        if (newY + newH > maxH) { newY = Math.max(0, maxH - newH); }
        if (newW < minSize) { newW = minSize; newH = Math.round(newW / targetRatio); }
        setCropArea({ x: newX, y: newY, width: newW, height: newH });
        return;
      }

      if (activeDrag === 'n' || activeDrag === 's') {
        let newH = Math.round(origH + (activeDrag === 's' ? deltaY : -deltaY));
        let newW = Math.round(newH * targetRatio);
        let newY = activeDrag === 's' ? origY : origY + origH - newH;
        let newX = Math.round(origX - (newW - origW) / 2);

        if (newY < 0) { newH += newY; newY = 0; newW = Math.round(newH * targetRatio); }
        if (newY + newH > maxH) { newH = maxH - newY; newW = Math.round(newH * targetRatio); }
        if (newX < 0) { newX = 0; }
        if (newX + newW > maxW) { newX = Math.max(0, maxW - newW); }
        if (newH < minSize) { newH = minSize; newW = Math.round(newH * targetRatio); }
        setCropArea({ x: newX, y: newY, width: newW, height: newH });
        return;
      }
    },
    [activeDrag, imageState.width, imageState.height, ratioMode, ratios, rotation, flipH, flipV]
  );

  // Global window pointer listeners for flawless dragging even beyond container boundaries
  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e: PointerEvent) => {
      updateCropFromPointer(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [activeDrag, updateCropFromPointer]);

  // Click on background backdrop to begin drawing a new crop box
  const handleBackdropPointerDown = (e: React.PointerEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const scale = imageState.width / (imgRef.current.clientWidth || 1);

    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const screenDx = e.clientX - (rect.left + rect.width / 2);
    const screenDy = e.clientY - (rect.top + rect.height / 2);

    const unscaledDx = (cos * screenDx + sin * screenDy) * (flipH ? -1 : 1);
    const unscaledDy = (-sin * screenDx + cos * screenDy) * (flipV ? -1 : 1);

    const localX = Math.max(0, Math.min(imageState.width, Math.round(imageState.width / 2 + unscaledDx * scale)));
    const localY = Math.max(0, Math.min(imageState.height, Math.round(imageState.height / 2 + unscaledDy * scale)));

    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      cropX: localX,
      cropY: localY,
      cropW: 0,
      cropH: 0,
    };
    setActiveDrag('draw');
  };

  const rotateCw = () => setRotation((prev) => (prev + 90) % 360);
  const rotateCcw = () => setRotation((prev) => (prev - 90 + 360) % 360);

  const executeCrop = async () => {
    if (cropArea.width <= 0 || cropArea.height <= 0) {
      alert('Please enter or select a valid crop area greater than 0 pixels.');
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

      const options: CropOptions = {
        cropArea,
        format,
        quality,
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

  // Convert crop area to percentage for CSS placement
  const cropLeftPct = (cropArea.x / imageState.width) * 100;
  const cropTopPct = (cropArea.y / imageState.height) * 100;
  const cropWidthPct = (cropArea.width / imageState.width) * 100;
  const cropHeightPct = (cropArea.height / imageState.height) * 100;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Aspect Ratio Buttons */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Aspect Ratio
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {ratioMode === 'free' ? 'Freeform (drag any handle to resize freely)' : `Locked to ${ratioMode}`}
          </span>
        </div>
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

      {/* Manual Dimensions and Center / Reset bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-end p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Width (px)
          </label>
          <input
            type="number"
            min="0"
            max={imageState.width}
            value={cropArea.width}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleManualWidth(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Height (px)
          </label>
          <input
            type="number"
            min="0"
            max={imageState.height}
            value={cropArea.height}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleManualHeight(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={centerCropBox}
          className="py-2 px-3 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          title="Center the active crop box"
        >
          <Focus className="w-3.5 h-3.5" />
          <span>Center Box</span>
        </button>
        <button
          type="button"
          onClick={resetToFull}
          className="py-2 px-3 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          title="Reset to entire image"
        >
          <ResetIcon className="w-3.5 h-3.5" />
          <span>Full Image</span>
        </button>
      </div>

      {/* Interactive Visual Canvas Container */}
      <div className="relative w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 select-none">
        <div
          ref={containerRef}
          onPointerDown={handleBackdropPointerDown}
          className="relative inline-block overflow-hidden touch-none cursor-crosshair"
          style={{
            transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            transition: activeDrag ? 'none' : 'transform 0.2s ease',
          }}
        >
          {/* Base image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageState.previewUrl}
            alt="Source for crop"
            className="w-full max-h-[380px] object-contain pointer-events-none block"
          />

          {/* Semi-transparent dark backdrop overlay */}
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          {/* Draggable & Resizable Active Crop Box */}
          <div
            onPointerDown={(e) => startDrag(e, 'move')}
            className="absolute border-2 border-white cursor-move shadow-2xl ring-1 ring-blue-500/80 group touch-none"
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

            {/* Current dimensions badge */}
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white pointer-events-none z-10 shadow-sm">
              {cropArea.width} × {cropArea.height} px
            </div>

            {/* 8 Interactive Mouse Resize Handles */}
            {/* Top-Left Corner */}
            <div
              onPointerDown={(e) => startDrag(e, 'nw')}
              className="absolute -top-3.5 -left-3.5 w-7 h-7 flex items-center justify-center cursor-nwse-resize z-20 group/handle touch-none"
              title="Resize Top-Left"
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Top-Right Corner */}
            <div
              onPointerDown={(e) => startDrag(e, 'ne')}
              className="absolute -top-3.5 -right-3.5 w-7 h-7 flex items-center justify-center cursor-nesw-resize z-20 group/handle touch-none"
              title="Resize Top-Right"
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Bottom-Left Corner */}
            <div
              onPointerDown={(e) => startDrag(e, 'sw')}
              className="absolute -bottom-3.5 -left-3.5 w-7 h-7 flex items-center justify-center cursor-nesw-resize z-20 group/handle touch-none"
              title="Resize Bottom-Left"
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Bottom-Right Corner */}
            <div
              onPointerDown={(e) => startDrag(e, 'se')}
              className="absolute -bottom-3.5 -right-3.5 w-7 h-7 flex items-center justify-center cursor-nwse-resize z-20 group/handle touch-none"
              title="Resize Bottom-Right"
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-sm shadow-md group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Top Center Edge */}
            <div
              onPointerDown={(e) => startDrag(e, 'n')}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center cursor-ns-resize z-20 group/handle touch-none"
              title="Resize Top Edge"
            >
              <div className="w-6 h-1.5 bg-white border border-blue-600 rounded-full shadow-sm group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Bottom Center Edge */}
            <div
              onPointerDown={(e) => startDrag(e, 's')}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-6 flex items-center justify-center cursor-ns-resize z-20 group/handle touch-none"
              title="Resize Bottom Edge"
            >
              <div className="w-6 h-1.5 bg-white border border-blue-600 rounded-full shadow-sm group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Middle Left Edge */}
            <div
              onPointerDown={(e) => startDrag(e, 'w')}
              className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-8 flex items-center justify-center cursor-ew-resize z-20 group/handle touch-none"
              title="Resize Left Edge"
            >
              <div className="w-1.5 h-6 bg-white border border-blue-600 rounded-full shadow-sm group-hover/handle:scale-125 transition-transform" />
            </div>

            {/* Middle Right Edge */}
            <div
              onPointerDown={(e) => startDrag(e, 'e')}
              className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-8 flex items-center justify-center cursor-ew-resize z-20 group/handle touch-none"
              title="Resize Right Edge"
            >
              <div className="w-1.5 h-6 bg-white border border-blue-600 rounded-full shadow-sm group-hover/handle:scale-125 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Orientation Controls (Rotation & Flip) */}
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

      {/* Format & Quality Settings */}
      <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Output Format
          </label>
          <div className="flex gap-1.5">
            {[
              { id: 'image/jpeg', name: 'JPG' },
              { id: 'image/png', name: 'PNG' },
              { id: 'image/webp', name: 'WebP' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id as ImageFormat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  format === f.id
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {format !== 'image/png' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quality
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
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
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Execute Button */}
      <button
        onClick={executeCrop}
        disabled={isProcessing || cropArea.width <= 0 || cropArea.height <= 0}
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
