import React from 'react';

interface AdBannerProps {
  slot?: 'top' | 'middle' | 'sidebar';
  className?: string;
}

export function AdBanner({ slot = 'middle', className = '' }: AdBannerProps) {
  if (slot === 'sidebar') {
    return (
      <aside
        className={`w-full max-w-[300px] min-h-[250px] mx-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center p-4 text-center ${className}`}
        aria-label="Advertisement"
      >
        <span className="text-[10px] tracking-widest uppercase font-medium text-slate-400 dark:text-slate-500">
          Advertisement
        </span>
      </aside>
    );
  }

  return (
    <aside
      className={`w-full max-w-4xl mx-auto my-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center min-h-[90px] sm:min-h-[100px] transition-all p-4 ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] tracking-widest uppercase font-medium text-slate-400 dark:text-slate-500">
        Advertisement
      </span>
    </aside>
  );
}
