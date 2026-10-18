import { CompressPdfOptions, PdfFileState, PdfProcessedResult } from './types';
import { sanitizeFileName } from '@/lib/utils';

/**
 * Loads a PDF file and inspects basic metadata (page count, password check)
 */
export async function getPdfMetadata(file: File): Promise<PdfFileState> {
  const pdfjs = await import('pdfjs-dist');
  if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      stopAtErrors: false,
    });

    const doc = await loadingTask.promise;
    const pageCount = doc.numPages;

    // Generate quick thumbnail of page 1
    let previewUrl: string | undefined = undefined;
    try {
      const page1 = await doc.getPage(1);
      const viewport = page1.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page1.render({ canvasContext: ctx, viewport }).promise;
        previewUrl = canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch {
      // preview is optional
    }

    return {
      file,
      name: file.name,
      size: file.size,
      pageCount,
      previewUrl,
    };
  } catch (err: any) {
    if (err?.name === 'PasswordException' || err?.message?.toLowerCase().includes('password')) {
      throw new Error('This PDF is password-protected. Please remove the password before compressing.');
    }
    if (err?.name === 'InvalidPDFException' || err?.message?.toLowerCase().includes('invalid pdf')) {
      throw new Error('The selected file is corrupt or not a recognized PDF document.');
    }
    throw new Error(err?.message || 'Failed to read PDF. Please ensure the file is valid and readable.');
  }
}

/**
 * Compresses a PDF file client-side by rendering pages to canvas and re-encoding with pdf-lib.
 * Heavy libraries are dynamically imported only when compression starts.
 */
export async function compressPdf(
  pdfState: PdfFileState,
  options: CompressPdfOptions,
  onProgress?: (progressPercent: number, statusText: string) => void
): Promise<PdfProcessedResult> {
  const startTime = performance.now();
  onProgress?.(5, 'Initializing PDF engine...');

  const [pdfjs, { PDFDocument }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdf-lib'),
  ]);

  if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
  }

  onProgress?.(10, 'Loading PDF document...');
  const arrayBuffer = await pdfState.file.arrayBuffer();

  let srcDoc;
  try {
    srcDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  } catch (err: any) {
    if (err?.name === 'PasswordException') {
      throw new Error('This PDF is password-protected. Please remove the password first.');
    }
    throw new Error('Could not open PDF file. It may be corrupt or encrypted.');
  }

  const numPages = srcDoc.numPages;
  if (numPages === 0) {
    throw new Error('The PDF document contains 0 pages.');
  }

  // Determine rendering scale and JPEG quality based on preset or target size
  let scale = 1.2;
  let quality = 0.65;

  if (options.preset === 'low') {
    // Light compression: high visual fidelity
    scale = 1.5;
    quality = 0.82;
  } else if (options.preset === 'medium') {
    // Recommended balanced compression
    scale = 1.2;
    quality = 0.65;
  } else if (options.preset === 'high') {
    // Aggressive compression
    scale = 0.9;
    quality = 0.45;
  } else if (options.preset === 'target' && options.targetSizeKb) {
    // Calculate allowable budget per page in KB
    const targetKbPerPage = options.targetSizeKb / numPages;

    if (targetKbPerPage < 30) {
      scale = 0.75;
      quality = 0.35;
    } else if (targetKbPerPage < 70) {
      scale = 0.9;
      quality = 0.50;
    } else if (targetKbPerPage < 150) {
      scale = 1.1;
      quality = 0.65;
    } else {
      scale = 1.3;
      quality = 0.75;
    }
  }

  const newPdfDoc = await PDFDocument.create();

  // Process each page sequentially
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const pageProgress = 15 + Math.round(((pageNum - 1) / numPages) * 75);
    onProgress?.(pageProgress, `Compressing page ${pageNum} of ${numPages}...`);

    const page = await srcDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Render page to canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not allocate canvas for page rendering');

    // Fill white background for pages with transparency
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    // Convert canvas to compressed JPEG
    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`Failed to compress page ${pageNum}`))),
        'image/jpeg',
        quality
      );
    });

    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
    const embeddedJpg = await newPdfDoc.embedJpg(jpegBytes);

    // Get original unscaled page dimensions in points to keep document geometry
    const originalViewport = page.getViewport({ scale: 1.0 });
    const newPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);

    newPage.drawImage(embeddedJpg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  onProgress?.(92, 'Finalizing compressed document...');
  const newPdfBytes = await newPdfDoc.save();
  const compressedBlob = new Blob([newPdfBytes as unknown as BlobPart], { type: 'application/pdf' });

  // Check skipIfLarger condition
  let finalBlob = compressedBlob;
  let skipped = false;

  if (options.skipIfLarger && compressedBlob.size >= pdfState.size) {
    skipped = true;
  }

  const downloadBlob = skipped ? pdfState.file : finalBlob;
  const resultUrl = URL.createObjectURL(downloadBlob);

  const baseName = pdfState.name.replace(/\.[^.]+$/, '');
  const downloadName = sanitizeFileName(
    skipped ? pdfState.name : `${baseName}-compressed.pdf`,
    'document-compressed.pdf'
  );

  onProgress?.(100, 'Complete!');

  return {
    blob: downloadBlob,
    url: resultUrl,
    name: downloadName,
    size: downloadBlob.size,
    originalSize: pdfState.size,
    pageCount: numPages,
    processingTimeMs: Math.round(performance.now() - startTime),
    isFlattened: !skipped,
    skippedBecauseLarger: skipped,
  };
}
