'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from '@/components/Breadcrumbs';
import { PrivacyBadge, PrivacyCard } from '@/components/PrivacyBadge';
import { AdBanner } from '@/components/AdBanner';
import { JsonLd } from '@/components/JsonLd';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageFileState } from '@/lib/types';
import { PdfFileState, PdfPageData, PdfProcessedResult } from '../types';
import { PdfUploader } from './PdfUploader';
import { ImageToPdfTool } from './ImageToPdfTool';
import { CompressPdfTool } from './CompressPdfTool';
import { PdfDownloadCard } from './PdfDownloadCard';
import {
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface PdfPageTemplateProps {
  pageData: PdfPageData;
  breadcrumbs: BreadcrumbItem[];
}

export function PdfPageTemplate({ pageData, breadcrumbs }: PdfPageTemplateProps) {
  // For image-to-pdf tools
  const [imageState, setImageState] = useState<ImageFileState | null>(null);

  // For compress-pdf tools
  const [pdfState, setPdfState] = useState<PdfFileState | null>(null);

  // Processed result
  const [processedResult, setProcessedResult] = useState<PdfProcessedResult | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleReset = () => {
    setProcessedResult(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Structured SEO Schema */}
      <JsonLd
        type="all"
        name={pageData.title}
        description={pageData.metaDescription}
        faqs={pageData.faqs}
        steps={pageData.howToSteps}
        breadcrumbs={breadcrumbs.map((b) => ({
          name: b.name,
          item: `https://imageresizenow.com${b.href}`,
        }))}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Above-The-Fold Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {pageData.badge}
            </span>
            <PrivacyBadge />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {pageData.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {pageData.description}
          </p>
        </div>

        {/* Tool Section (Visible Above The Fold) */}
        <section aria-label="Interactive PDF Tool" className="mt-6">
          {processedResult ? (
            <PdfDownloadCard result={processedResult} onReset={handleReset} />
          ) : (
            <div className="space-y-6">
              {pageData.toolType === 'image-to-pdf' ? (
                <>
                  <ImageUploader
                    imageState={imageState}
                    onImageLoaded={(img) => {
                      setImageState(img);
                      setProcessedResult(null);
                    }}
                    title="Upload Image to Convert to PDF"
                    subtitle="Drop your JPG, PNG, or WebP photo here, paste from clipboard (Ctrl+V), or browse"
                  />

                  {imageState && (
                    <div className="transition-all duration-300">
                      <ImageToPdfTool
                        imageState={imageState}
                        onResult={setProcessedResult}
                        defaultPageSize={pageData.defaultConfig?.pageSize}
                        defaultOrientation={pageData.defaultConfig?.orientation}
                        defaultMargin={pageData.defaultConfig?.margin}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <PdfUploader
                    pdfState={pdfState}
                    onPdfLoaded={(pdf) => {
                      setPdfState(pdf);
                      setProcessedResult(null);
                    }}
                    title="Upload PDF to Compress"
                    subtitle="Drop your PDF here (100% private in-browser compression, zero server uploads)"
                  />

                  {pdfState && (
                    <div className="transition-all duration-300">
                      <CompressPdfTool
                        pdfState={pdfState}
                        onResult={setProcessedResult}
                        defaultPreset={pageData.defaultConfig?.compressPreset}
                        defaultTargetKb={pageData.defaultConfig?.targetKb}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        {/* Reserved Ad Banner to prevent CLS */}
        <AdBanner slot="middle" />

        {/* Step-by-Step How-To Section (Matches HowTo schema) */}
        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>How to {pageData.h1} in 4 Easy Steps</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pageData.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  {step.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deep-Dive Editorial Content Sections (300 to 600 words) */}
        {pageData.contentSections && pageData.contentSections.length > 0 && (
          <section className="mt-12 space-y-6">
            {pageData.contentSections.map((sec, idx) => (
              <article
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {sec.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              </article>
            ))}
          </section>
        )}

        {/* Privacy Highlight Card */}
        <section className="mt-10">
          <PrivacyCard />
        </section>

        {/* Frequently Asked Questions (Matches FAQPage schema) */}
        {pageData.faqs && pageData.faqs.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {pageData.faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 group"
                    >
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`${
                        isOpen ? 'block' : 'hidden'
                      } px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80`}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Tools and Programmatic Internal Links */}
        {pageData.relatedPages && pageData.relatedPages.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Related Image & PDF Tools</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {pageData.relatedPages.map((rel, idx) => (
                <Link
                  key={idx}
                  href={rel.href}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group shadow-sm"
                >
                  <span className="truncate">{rel.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
