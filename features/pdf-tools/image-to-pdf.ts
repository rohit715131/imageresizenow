import { ImageToPdfOptions, PdfProcessedResult } from './types';
import { ImageFileState } from '@/lib/types';
import { sanitizeFileName } from '@/lib/utils';

/**
 * Converts an image file to a single-page PDF using pdf-lib.
 * Heavy library (pdf-lib) is dynamically imported to protect Core Web Vitals.
 */
export async function convertImageToPdf(
  imageState: ImageFileState,
  options: ImageToPdfOptions,
  onProgress?: (progressPercent: number, statusText: string) => void
): Promise<PdfProcessedResult> {
  const startTime = performance.now();
  onProgress?.(10, 'Loading PDF engine...');

  // Dynamically import pdf-lib only on demand
  const { PDFDocument, PageSizes } = await import('pdf-lib');

  onProgress?.(30, 'Preparing image data...');
  const pdfDoc = await PDFDocument.create();

  let imageBytes: Uint8Array;
  let isPng = imageState.type === 'image/png';
  let isJpeg = imageState.type === 'image/jpeg' || imageState.type === 'image/jpg';

  // If user requested quality adjustment or if the image is WebP/AVIF/other canvas format,
  // re-encode through canvas to high-quality JPEG or PNG
  if (!isJpeg && !isPng) {
    onProgress?.(50, 'Converting modern format (WebP/AVIF) for PDF embedding...');
    const canvas = document.createElement('canvas');
    canvas.width = imageState.width;
    canvas.height = imageState.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    const img = new Image();
    img.src = imageState.previewUrl;
    await new Promise((res, rej) => {
      if (img.complete) return res(null);
      img.onload = () => res(null);
      img.onerror = rej;
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to create image blob'))),
        'image/jpeg',
        options.quality
      );
    });

    const buffer = await blob.arrayBuffer();
    imageBytes = new Uint8Array(buffer);
    isJpeg = true;
  } else if (options.quality < 0.98 && isJpeg) {
    // Recompress JPEG if user changed quality slider
    onProgress?.(50, 'Adjusting image quality...');
    const canvas = document.createElement('canvas');
    canvas.width = imageState.width;
    canvas.height = imageState.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    const img = new Image();
    img.src = imageState.previewUrl;
    await new Promise((res, rej) => {
      if (img.complete) return res(null);
      img.onload = () => res(null);
      img.onerror = rej;
    });

    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to create image blob'))),
        'image/jpeg',
        options.quality
      );
    });
    const buffer = await blob.arrayBuffer();
    imageBytes = new Uint8Array(buffer);
  } else {
    // Read raw bytes directly for lossless preservation
    const buffer = await imageState.file.arrayBuffer();
    imageBytes = new Uint8Array(buffer);
  }

  onProgress?.(70, 'Embedding image into PDF document...');
  let embeddedImage;
  if (isPng) {
    try {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } catch {
      // Fallback: If PNG has unsupported chunks, re-encode to JPEG
      const canvas = document.createElement('canvas');
      canvas.width = imageState.width;
      canvas.height = imageState.height;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.src = imageState.previewUrl;
      await new Promise((res, rej) => {
        if (img.complete) return res(null);
        img.onload = () => res(null);
        img.onerror = rej;
      });
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const fallbackBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.92));
      const fallbackBuffer = await fallbackBlob.arrayBuffer();
      embeddedImage = await pdfDoc.embedJpg(new Uint8Array(fallbackBuffer));
    }
  } else {
    embeddedImage = await pdfDoc.embedJpg(imageBytes);
  }

  const imgW = embeddedImage.width;
  const imgH = embeddedImage.height;

  // Determine standard page dimensions in points (72 pt per inch)
  let basePageW: number;
  let basePageH: number;

  if (options.pageSize === 'a4') {
    [basePageW, basePageH] = PageSizes.A4; // [595.28, 841.89]
  } else if (options.pageSize === 'letter') {
    [basePageW, basePageH] = PageSizes.Letter; // [612, 792]
  } else {
    // 'fit': page size matches image proportions directly
    basePageW = imgW;
    basePageH = imgH;
  }

  // Determine orientation
  let isLandscape = false;
  if (options.orientation === 'auto') {
    isLandscape = imgW > imgH;
  } else if (options.orientation === 'landscape') {
    isLandscape = true;
  } else {
    isLandscape = false;
  }

  let finalPageW = basePageW;
  let finalPageH = basePageH;

  if (options.pageSize !== 'fit') {
    const minDim = Math.min(basePageW, basePageH);
    const maxDim = Math.max(basePageW, basePageH);
    finalPageW = isLandscape ? maxDim : minDim;
    finalPageH = isLandscape ? minDim : maxDim;
  }

  // Margin calculation
  let marginPt = 0;
  if (options.pageSize !== 'fit') {
    if (options.margin === 'small') {
      marginPt = 18; // 0.25 inch
    } else if (options.margin === 'big') {
      marginPt = 36; // 0.5 inch
    }
  }

  const printableW = Math.max(10, finalPageW - marginPt * 2);
  const printableH = Math.max(10, finalPageH - marginPt * 2);

  // Scale image to fit within printable area
  const scale = Math.min(printableW / imgW, printableH / imgH);
  const drawnW = imgW * scale;
  const drawnH = imgH * scale;

  // Center the image on the page
  const x = marginPt + (printableW - drawnW) / 2;
  const y = marginPt + (printableH - drawnH) / 2;

  const page = pdfDoc.addPage([finalPageW, finalPageH]);
  page.drawImage(embeddedImage, {
    x,
    y,
    width: drawnW,
    height: drawnH,
  });

  onProgress?.(90, 'Generating final PDF document...');
  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const baseName = imageState.name.replace(/\.[^.]+$/, '');
  const downloadName = sanitizeFileName(`${baseName}.pdf`, 'converted-document.pdf');

  onProgress?.(100, 'Done!');

  return {
    blob: pdfBlob,
    url: pdfUrl,
    name: downloadName,
    size: pdfBlob.size,
    originalSize: imageState.size,
    pageCount: 1,
    processingTimeMs: Math.round(performance.now() - startTime),
    isFlattened: false,
  };
}
