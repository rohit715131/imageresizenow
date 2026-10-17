import {
  ImageFileState,
  ImageFormat,
  ProcessedResult,
  ResizeOptions,
  CompressOptions,
  ConvertOptions,
  CropOptions,
} from './types';
import { sanitizeFileName } from './utils';

/**
 * Loads an image File into an HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image. The format may not be supported by this browser.'));
    };
    img.src = url;
  });
}

/**
 * Extracts image metadata from a File
 */
export async function getImageMetadata(file: File): Promise<ImageFileState> {
  const img = await loadImageFromFile(file);
  const previewUrl = img.src;
  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type || 'image/jpeg',
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1),
    previewUrl,
  };
}

/**
 * Creates high-quality canvas element with smoothing enabled
 */
function createSmoothingCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { canvas, ctx };
}

/**
 * Canvas to Blob helper with fallback
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // fallback to PNG if requested format unsupported
            canvas.toBlob(
              (fallbackBlob) => {
                if (fallbackBlob) resolve(fallbackBlob);
                else reject(new Error('Failed to convert canvas to blob'));
              },
              'image/png'
            );
          }
        },
        format,
        quality
      );
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Helper to get file extension from MIME type
 */
export function getExtensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
}

/**
 * Resize Image Process
 */
export async function resizeImage(
  imageEl: HTMLImageElement,
  originalState: ImageFileState,
  options: ResizeOptions
): Promise<ProcessedResult> {
  const startTime = performance.now();
  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.mode === 'percent') {
    const scale = Math.max(0.01, options.percent / 100);
    targetWidth = Math.round(originalState.width * scale);
    targetHeight = Math.round(originalState.height * scale);
  }

  const { canvas, ctx } = createSmoothingCanvas(targetWidth, targetHeight);

  // If output format does not support transparency, fill background with white
  if (options.format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Multi-step downscaling for highest quality if downscaling by > 50%
  if (targetWidth < originalState.width * 0.5 && targetHeight < originalState.height * 0.5) {
    let curW = originalState.width;
    let curH = originalState.height;
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = curW;
    tempCanvas.height = curH;
    tempCtx.drawImage(imageEl, 0, 0);

    while (curW * 0.5 > targetWidth && curH * 0.5 > targetHeight) {
      curW = Math.round(curW * 0.5);
      curH = Math.round(curH * 0.5);
      const nextCanvas = document.createElement('canvas');
      nextCanvas.width = curW;
      nextCanvas.height = curH;
      const nextCtx = nextCanvas.getContext('2d')!;
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(tempCanvas, 0, 0, curW, curH);
      tempCanvas = nextCanvas;
    }
    ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.drawImage(imageEl, 0, 0, targetWidth, targetHeight);
  }

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  const ext = getExtensionFromMime(blob.type || options.format);
  const downloadName = sanitizeFileName(originalState.name, `${targetWidth}x${targetHeight}.${ext}`);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: blob.size,
    width: targetWidth,
    height: targetHeight,
    format: blob.type || options.format,
    extension: ext,
    downloadName,
    processingTimeMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Smart Compress Image Process: Quality mode or Target File Size mode (binary search)
 */
export async function compressImage(
  imageEl: HTMLImageElement,
  originalState: ImageFileState,
  options: CompressOptions
): Promise<ProcessedResult> {
  const startTime = performance.now();
  let targetWidth = originalState.width;
  let targetHeight = originalState.height;

  // If user sets mode = 'quality'
  if (options.mode === 'quality') {
    const { canvas, ctx } = createSmoothingCanvas(targetWidth, targetHeight);
    if (options.format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    ctx.drawImage(imageEl, 0, 0, targetWidth, targetHeight);

    const blob = await canvasToBlob(canvas, options.format, options.quality);
    const ext = getExtensionFromMime(blob.type || options.format);
    const downloadName = sanitizeFileName(originalState.name, `compressed.${ext}`);
    const resultUrl = URL.createObjectURL(blob);

    return {
      blob,
      url: resultUrl,
      size: blob.size,
      width: targetWidth,
      height: targetHeight,
      format: blob.type || options.format,
      extension: ext,
      downloadName,
      processingTimeMs: Math.round(performance.now() - startTime),
    };
  }

  // Mode is 'target-size' (e.g. compress to under 50KB or 100KB)
  const targetBytes = Math.max(5 * 1024, options.targetSizeKb * 1024);
  const format = options.format === 'image/png' ? 'image/jpeg' : options.format; // JPEG/WebP is required for effective lossy target compression

  let lowQuality = 0.05;
  let highQuality = 0.95;
  let bestBlob: Blob | null = null;
  let scale = 1.0;

  // Check if native resolution at lowest quality is still bigger than targetBytes
  // If so, we also need to downscale gracefully to reach target size (e.g. 20KB for govt forms)
  for (let pass = 0; pass < 3; pass++) {
    const currentW = Math.max(100, Math.round(originalState.width * scale));
    const currentH = Math.max(100, Math.round(originalState.height * scale));
    const { canvas, ctx } = createSmoothingCanvas(currentW, currentH);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, currentW, currentH);
    ctx.drawImage(imageEl, 0, 0, currentW, currentH);

    // Binary search 6 iterations for optimal quality matching targetBytes
    let currentLow = lowQuality;
    let currentHigh = highQuality;

    for (let iter = 0; iter < 6; iter++) {
      const midQuality = (currentLow + currentHigh) / 2;
      const testBlob = await canvasToBlob(canvas, format, midQuality);

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        targetWidth = currentW;
        targetHeight = currentH;
        // Can we get better quality while staying under target?
        currentLow = midQuality;
      } else {
        // Blob is too large, need lower quality
        currentHigh = midQuality;
      }
    }

    if (bestBlob && bestBlob.size <= targetBytes) {
      break;
    }

    // Still too large at this resolution, scale down by 30% and retry
    scale *= 0.7;
  }

  // If still no blob under target, fall back to lowest quality on smallest scale
  if (!bestBlob) {
    const fallbackW = Math.round(originalState.width * scale);
    const fallbackH = Math.round(originalState.height * scale);
    const { canvas, ctx } = createSmoothingCanvas(fallbackW, fallbackH);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, fallbackW, fallbackH);
    ctx.drawImage(imageEl, 0, 0, fallbackW, fallbackH);
    bestBlob = await canvasToBlob(canvas, format, 0.1);
    targetWidth = fallbackW;
    targetHeight = fallbackH;
  }

  const ext = getExtensionFromMime(bestBlob.type || format);
  const downloadName = sanitizeFileName(originalState.name, `${options.targetSizeKb}kb.${ext}`);
  const resultUrl = URL.createObjectURL(bestBlob);

  return {
    blob: bestBlob,
    url: resultUrl,
    size: bestBlob.size,
    width: targetWidth,
    height: targetHeight,
    format: bestBlob.type || format,
    extension: ext,
    downloadName,
    processingTimeMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Format Convert Image Process
 */
export async function convertImage(
  imageEl: HTMLImageElement,
  originalState: ImageFileState,
  options: ConvertOptions
): Promise<ProcessedResult> {
  const startTime = performance.now();
  const width = originalState.width;
  const height = originalState.height;

  const { canvas, ctx } = createSmoothingCanvas(width, height);

  // Background handling for non-transparent target formats
  if (options.targetFormat === 'image/jpeg') {
    ctx.fillStyle = options.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(imageEl, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, options.targetFormat, options.quality);
  const ext = getExtensionFromMime(blob.type || options.targetFormat);
  const downloadName = sanitizeFileName(originalState.name, `converted.${ext}`);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: blob.size,
    width,
    height,
    format: blob.type || options.targetFormat,
    extension: ext,
    downloadName,
    processingTimeMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Visual Crop, Rotate & Flip Image Process
 */
export async function cropImage(
  imageEl: HTMLImageElement,
  originalState: ImageFileState,
  options: CropOptions
): Promise<ProcessedResult> {
  const startTime = performance.now();
  const { cropArea, rotation, flipHorizontal, flipVertical, format, quality } = options;

  const cropW = Math.max(1, Math.round(cropArea.width));
  const cropH = Math.max(1, Math.round(cropArea.height));

  // Determine canvas dimensions based on 90 / 270 deg rotations
  const isRotated90 = rotation === 90 || rotation === 270;
  const outputW = isRotated90 ? cropH : cropW;
  const outputH = isRotated90 ? cropW : cropH;

  const { canvas, ctx } = createSmoothingCanvas(outputW, outputH);

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputW, outputH);
  }

  ctx.save();
  // Move origin to center of canvas for rotation and flip transforms
  ctx.translate(outputW / 2, outputH / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

  // Draw the cropped section centered
  ctx.drawImage(
    imageEl,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    -cropW / 2,
    -cropH / 2,
    cropW,
    cropH
  );

  ctx.restore();

  const blob = await canvasToBlob(canvas, format, quality);
  const ext = getExtensionFromMime(blob.type || format);
  const downloadName = sanitizeFileName(originalState.name, `cropped.${ext}`);
  const resultUrl = URL.createObjectURL(blob);

  return {
    blob,
    url: resultUrl,
    size: blob.size,
    width: outputW,
    height: outputH,
    format: blob.type || format,
    extension: ext,
    downloadName,
    processingTimeMs: Math.round(performance.now() - startTime),
  };
}

/**
 * Creates a sample SVG image as a File object so users can test immediately
 */
export function createSampleImage(type: 'landscape' | 'portrait' | 'avatar' = 'landscape'): File {
  const canvas = document.createElement('canvas');
  let width = 1200;
  let height = 800;
  let label = 'Sample Nature View';

  if (type === 'portrait') {
    width = 800;
    height = 1200;
    label = 'Sample Portrait Photo';
  } else if (type === 'avatar') {
    width = 600;
    height = 600;
    label = 'Sample Avatar / ID';
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Draw beautiful vibrant gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (type === 'landscape') {
    grad.addColorStop(0, '#2563eb');
    grad.addColorStop(0.5, '#06b6d4');
    grad.addColorStop(1, '#10b981');
  } else if (type === 'portrait') {
    grad.addColorStop(0, '#ec4899');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#3b82f6');
  } else {
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#ef4444');
    grad.addColorStop(1, '#8b5cf6');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(width * 0.25, height * 0.35, Math.min(width, height) * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.65, Math.min(width, height) * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.round(width * 0.045)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, width / 2, height / 2 - 20);

  ctx.font = `normal ${Math.round(width * 0.025)}px system-ui, sans-serif`;
  ctx.fillText(`${width} x ${height} px • Free Online Image Toolkit`, width / 2, height / 2 + 35);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: 'image/jpeg' });
  return new File([blob], `${type}-sample-${width}x${height}.jpg`, { type: 'image/jpeg' });
}
