import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldCheck, Cpu, HardDrive, Zap, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Privacy-First In-Browser Image Toolkit',
  description:
    'Learn about ImageResizeNow: our mission, client-side WebAssembly and HTML5 Canvas technology, and commitment to 100% device-level privacy.',
  alternates: {
    canonical: 'https://imageresizenow.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs items={[{ name: 'About Us', href: '/about' }]} />

        <div className="my-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Client-Side Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About ImageResizeNow
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            A fast, free, and privacy-respecting toolkit engineered to process images and documents directly in your browser.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Our Mission: True In-Browser Privacy
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Most online image editors require you to upload personal photos, passport scans, and financial documents to remote cloud servers. Once uploaded, you have no way of knowing how long those files remain cached on third-party disks or who has access to them.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ImageResizeNow was built on a different principle: <strong>your files should never leave your device</strong>. Utilizing modern WebAssembly, Web Workers, and HTML5 Canvas APIs, every resizing, compression, conversion, and PDF flattening operation runs entirely inside your device&apos;s local memory.
          </p>
        </section>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We operate no backend processing servers that store or inspect user media. All computations happen in your browser sandbox.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Hardware Acceleration
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By using your local GPU and CPU via browser canvas primitives, operations complete in milliseconds without upload bandwidth delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Honest Business Model
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Supported by standard display ads. Third-party ad partners never have access to any images, documents, or processed files.
            </p>
          </div>
        </div>

        {/* What We Support */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Supported Formats & Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>JPEG / JPG:</strong> Efficient downscaling and target file size compression.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>PNG:</strong> Transparent alpha channel preservation and format conversion.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>WebP &amp; AVIF:</strong> Next-generation compression for smaller web asset footprints.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>HEIC / HEIF:</strong> In-browser decode for modern Apple iPhone photos.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>GIF &amp; BMP:</strong> Quick resizing and conversion of legacy raster graphics.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>PDF Utilities:</strong> Image-to-PDF compilation and client-side PDF document compression.</span>
            </div>
          </div>
        </section>

        {/* Contact and Links */}
        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Have Feedback or Feature Suggestions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              We are continually refining our algorithms. Let us know how we can make our tools even better.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
