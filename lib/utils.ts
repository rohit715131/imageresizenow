import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatPercentage(before: number, after: number): { text: string; isReduction: boolean; percent: number } {
  if (!before || !after) return { text: '0%', isReduction: false, percent: 0 };
  const diff = before - after;
  const pct = Math.round((Math.abs(diff) / before) * 100);
  if (diff > 0) {
    return { text: `-${pct}%`, isReduction: true, percent: pct };
  } else if (diff < 0) {
    return { text: `+${pct}%`, isReduction: false, percent: pct };
  }
  return { text: '0%', isReduction: false, percent: 0 };
}

export function sanitizeFileName(name: string, newExt?: string): string {
  const base = name.substring(0, name.lastIndexOf('.')) || name;
  const sanitized = base.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (newExt) {
    return `${sanitized}.${newExt.replace(/^\./, '')}`;
  }
  const ext = name.substring(name.lastIndexOf('.') + 1);
  return `${sanitized}.${ext}`;
}
