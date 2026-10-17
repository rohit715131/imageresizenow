import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldCheck, Lock, EyeOff, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - 100% Client-Side In-Browser Processing',
  description:
    'Our privacy policy explains why ImageResizeNow is fundamentally private: images are processed client-side in your browser and are never uploaded or stored.',
  alternates: {
    canonical: 'https://imageresizenow.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs items={[{ name: 'Privacy Policy', href: '/privacy' }]} />

        <div className="my-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-3 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy as the Headline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: October 17, 2026</p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 mb-8">
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>The Core Guarantee: Your Images Never Leave Your Device</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
            Unlike traditional image conversion websites that upload your files to remote servers, ImageResizeNow executes all image processing algorithms (resizing, compression, format conversion, and cropping) directly inside your web browser using HTML5 Canvas and WebAssembly.
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. What Information We Do NOT Collect
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Images or Photos:</strong> Your files never travel across the internet. We do not have servers receiving or storing uploaded images.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No User Accounts or Passwords:</strong> There is no registration or login requirement.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>No Tracking Cookies:</strong> We do not use third-party invasive profiling cookies.</span>
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Anonymous Aggregated Analytics
            </h2>
            <p>
              We monitor aggregate website traffic using privacy-friendly analytics and Google Search Console to understand which tools are most helpful. These metrics record anonymous query counts without collecting IP addresses, personal identifiers, or file contents.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Local Storage Preferences
            </h2>
            <p>
              We use your browser's local storage solely to remember your UI preference (Light mode vs. Dark mode). This preference stays on your computer and is never transmitted to us.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Contact Inquiries
            </h2>
            <p>
              If you voluntarily submit a message or bug report through our contact form, we collect your name, email, and message solely to respond to your inquiry. We never sell or share contact details with advertisers.
            </p>
            <p>
              Have a question, found a bug, or want to know more about how ImageResizeNow works? Visit our{' '}
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Contact page
              </Link>{' '}
              and send us a message anytime. A real person reads every message, and we aim to reply within 2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
