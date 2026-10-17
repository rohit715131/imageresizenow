import React from 'react';

interface AdBannerProps {
  slot?: 'top' | 'middle' | 'sidebar';
  className?: string;
}

export function AdBanner({ slot = 'middle', className = '' }: AdBannerProps) {
  // Reserved fixed aspect/height containers guarantee ZERO Cumulative Layout Shift (CLS = 0)
  if (slot === 'sidebar') {
    return (
      <div
        className={`w-full max-w-[300px] min-h-[250px] mx-auto rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center ${className}`}
        aria-label="Advertisement Placeholder"
      >
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500 mb-2">
          Advertisement
        </span>
        <div className="w-full h-[200px] rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
          Reserved 300×250 Ad Space (CLS Safe)
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center p-2 min-h-[90px] sm:min-h-[100px] transition-all ${className}`}
      aria-label="Advertisement Placeholder"
    >
      <div className="flex items-center justify-between w-full px-2 mb-1">
        <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 dark:text-slate-500">
          Sponsored Space
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Reserved for zero Cumulative Layout Shift (CLS)
        </span>
      </div>
      <div className="w-full h-16 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-mono">
        Responsive Ad Unit (728×90 / 320×50)
      </div>
    </div>
  );
}
