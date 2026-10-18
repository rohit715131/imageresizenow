import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export function PrivacyBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-sm transition-all whitespace-nowrap ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span className="font-bold">100% Private</span>
      <span className="text-emerald-400 dark:text-emerald-600">•</span>
      <span className="text-emerald-700 dark:text-emerald-300">
        <span className="inline sm:hidden">Zero Uploads</span>
        <span className="hidden sm:inline">Processed in browser, never uploaded</span>
      </span>
    </div>
  );
}

export function PrivacyCard() {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-200">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500 text-white shrink-0 shadow-md shadow-emerald-500/20">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Zero Server Uploads. Your Privacy is 100% Guaranteed.
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike other online image converters that transfer your confidential documents, family pictures, and signatures to remote cloud servers, this toolkit runs WebAssembly and HTML5 Canvas algorithms entirely inside your browser sandbox. Your files never leave your device.
          </p>
          <div className="mt-3 flex items-center gap-6 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" /> No tracking cookies
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> No file storage
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Offline capable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
