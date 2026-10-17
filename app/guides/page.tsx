import { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/lib/guides-data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image Optimization Guides & Tutorials - ImageResizeNow',
  description:
    'Free guides and technical tutorials on image compression, format comparisons (WebP vs JPG vs AVIF), and social media sizing best practices.',
  alternates: {
    canonical: 'https://imageresizenow.com/guides',
  },
};

export default function GuidesIndexPage() {
  const guideList = Object.values(GUIDES);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs items={[{ name: 'Guides & Articles', href: '/guides' }]} />

        <div className="text-center sm:text-left mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Image Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Image Optimization Guides & Tutorials
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            In-depth technical guides, format benchmarks, and step-by-step sizing tutorials to help you master digital image optimization for web and mobile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guideList.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {guide.readTime}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {guide.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
