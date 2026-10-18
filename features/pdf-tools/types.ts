export type PageSizeOption = 'a4' | 'letter' | 'fit';
export type PageOrientationOption = 'auto' | 'portrait' | 'landscape';
export type PageMarginOption = 'none' | 'small' | 'big';

export interface ImageToPdfOptions {
  pageSize: PageSizeOption;
  orientation: PageOrientationOption;
  margin: PageMarginOption;
  quality: number; // 0.1 to 1.0
}

export type CompressionPreset = 'low' | 'medium' | 'high' | 'target';

export interface CompressPdfOptions {
  preset: CompressionPreset;
  targetSizeKb?: number; // e.g. 100, 200, 500, 1000
  skipIfLarger: boolean; // skip if compressed is larger than original
}

export interface PdfFileState {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  previewUrl?: string;
}

export interface PdfProcessedResult {
  blob: Blob;
  url: string;
  name: string;
  size: number;
  originalSize: number;
  pageCount: number;
  processingTimeMs: number;
  isFlattened: boolean;
  skippedBecauseLarger?: boolean;
}

export interface PdfPageData {
  slug: string;
  route: string;
  title: string;
  metaDescription: string;
  h1: string;
  toolType: 'image-to-pdf' | 'compress-pdf';
  badge: string;
  description: string;
  howToSteps: { name: string; text: string }[];
  faqs: { question: string; answer: string }[];
  defaultConfig?: {
    pageSize?: PageSizeOption;
    orientation?: PageOrientationOption;
    margin?: PageMarginOption;
    quality?: number;
    compressPreset?: CompressionPreset;
    targetKb?: number;
    sourceFormat?: string;
  };
  contentSections: {
    title: string;
    content: string;
  }[];
  relatedPages: { title: string; href: string }[];
}
