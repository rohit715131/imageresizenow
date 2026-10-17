export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export interface ImageFileState {
  file: File;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
  previewUrl: string;
}

export interface ProcessedResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
  extension: string;
  downloadName: string;
  processingTimeMs: number;
}

export interface ResizeOptions {
  mode: 'pixels' | 'percent' | 'preset';
  width: number;
  height: number;
  percent: number;
  maintainAspectRatio: boolean;
  format: ImageFormat;
  quality: number; // 0.1 to 1.0
}

export interface CompressOptions {
  mode: 'quality' | 'target-size';
  quality: number; // 0.05 to 1.0
  targetSizeKb: number; // e.g. 50, 100, 200
  format: ImageFormat;
  maxWidthOrHeight?: number;
}

export interface ConvertOptions {
  targetFormat: ImageFormat;
  quality: number;
  backgroundColor?: string; // for PNG with alpha to JPG
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  cropArea: CropArea;
  format: ImageFormat;
  quality: number;
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProgrammaticPageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  toolType: 'resize' | 'compress' | 'convert' | 'crop';
  badge: string;
  description: string;
  howToSteps: { name: string; text: string }[];
  faqs: FAQItem[];
  defaultConfig?: {
    width?: number;
    height?: number;
    targetKb?: number;
    quality?: number;
    sourceFormat?: string;
    targetFormat?: string;
    aspectRatio?: number;
  };
  relatedPages?: { title: string; href: string }[];
  contentSections: {
    title: string;
    content: string;
  }[];
}
