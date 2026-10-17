import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service - ImageResizeNow',
  description:
    'Terms of service and fair use conditions for ImageResizeNow free online image tools.',
  alternates: {
    canonical: 'https://imageresizenow.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs items={[{ name: 'Terms of Service', href: '/terms' }]} />

        <div className="my-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">Effective: October 17, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using ImageResizeNow, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use the service.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Free Personal and Commercial Use
            </h2>
            <p>
              ImageResizeNow is provided 100% free of charge for both personal and commercial purposes. You retain full ownership and copyright of any media you process using this site. No watermarks are applied, and no licensing fees are required.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Client-Side Execution & Disclaimer of Warranty
            </h2>
            <p>
              Because image transformation occurs entirely inside your web browser on your hardware, processing performance depends on your local device specifications. The service is provided "as is" without warranties of any kind.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
