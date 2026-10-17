import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/lib/guides-data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { AdBanner } from '@/components/AdBanner';
import { PrivacyCard } from '@/components/PrivacyBadge';
import {
  Clock,
  Calendar,
  User,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Maximize2,
  FileArchive,
  RefreshCw,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = GUIDES[params.slug];
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `https://imageresizenow.com/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: `https://imageresizenow.com/guides/${guide.slug}`,
    },
  };
}

export default function GuideDetailPage({ params }: PageProps) {
  const guide = GUIDES[params.slug];
  if (!guide) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <JsonLd
        type="all"
        name={guide.title}
        description={guide.description}
        url={`https://imageresizenow.com/guides/${guide.slug}`}
        faqs={guide.faqs}
        breadcrumbs={[
          { name: 'Guides', item: 'https://imageresizenow.com/guides' },
          { name: guide.title, item: `https://imageresizenow.com/guides/${guide.slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs
          items={[
            { name: 'Guides', href: '/guides' },
            { name: guide.title, href: `/guides/${guide.slug}` },
          ]}
        />

        <header className="my-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {guide.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <User className="w-3.5 h-3.5" /> {guide.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {guide.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {guide.readTime}
            </span>
          </div>
        </header>

        {/* Lead description */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
          {guide.description}
        </p>

        {/* Reserved Ad Slot */}
        <AdBanner slot="middle" />

        {/* Content Sections */}
        <div className="space-y-8 my-8">
          {guide.sections.map((sec, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
                {sec.heading}
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                {sec.body}
              </div>
            </section>
          ))}
        </div>

        {/* In-article CTA bar */}
        <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Ready to Optimize Your Images?</h3>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Test our 100% private in-browser tools with zero file upload waiting times.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/compress"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
            >
              Compress Images
            </Link>
            <Link
              href="/convert/png-to-webp"
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Convert to WebP
            </Link>
          </div>
        </div>

        {/* FAQs */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="my-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Questions Answered in this Guide</span>
            </h2>
            <div className="space-y-3">
              {guide.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          <PrivacyCard />
        </div>
      </article>
    </div>
  );
}
