'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ImageFileState,
  ProcessedResult,
} from '@/lib/types';
import { ImageUploader } from '@/components/ImageUploader';
import { DownloadCard } from '@/components/DownloadCard';
import { ResizeTool } from '@/components/Tools/ResizeTool';
import { CompressTool } from '@/components/Tools/CompressTool';
import { ConvertTool } from '@/components/Tools/ConvertTool';
import { CropTool } from '@/components/Tools/CropTool';
import { PrivacyBadge, PrivacyCard } from '@/components/PrivacyBadge';
import { AdBanner } from '@/components/AdBanner';
import { JsonLd } from '@/components/JsonLd';
import {
  Maximize2,
  FileArchive,
  RefreshCw,
  Crop,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sliders,
  Check,
  X as XIcon,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'resize' | 'compress' | 'convert' | 'crop'>('resize');
  const [imageState, setImageState] = useState<ImageFileState | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const homeFaqs = [
    {
      question: 'How is this image toolkit 100% private?',
      answer:
        'Unlike other image tools that transmit your files to cloud servers where they are stored or processed remotely, our toolkit executes all logic locally inside your browser using HTML5 Canvas and WebAssembly. Your photos, documents, and signatures never leave your computer or phone.',
    },
    {
      question: 'Is there any file size limit or daily usage cap?',
      answer:
        'No! Because processing happens on your local device hardware, there are no artificial file upload limits, no wait queues, and no premium restrictions.',
    },
    {
      question: 'Does this toolkit add any watermarks to my downloaded images?',
      answer:
        'Never. All processed images are completely watermark-free, full quality, and ready for commercial or personal use.',
    },
    {
      question: 'How do I compress an image to an exact size like 20KB or 50KB?',
      answer:
        'Select the "Compress" tab, choose "Target File Size Mode", and select 20KB, 50KB, or enter any custom KB target. Our iterative binary-search algorithm calculates the exact compression parameters to guarantee your file is under the limit without becoming illegible.',
    },
    {
      question: 'Which image formats are supported?',
      answer:
        'You can import and process JPG, PNG, WebP, AVIF, HEIC (iPhone photos), BMP, and GIF images.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <JsonLd
        type="all"
        name="ImageResizeNow - Free Online Image Toolkit"
        description="Free, private client-side image editor to resize, compress, convert, and crop images directly in your browser. Zero server uploads."
        url="https://imageresizenow.com"
        faqs={homeFaqs}
        steps={[
          { name: 'Upload Image', text: 'Select, drag and drop, or paste (Ctrl+V) an image.' },
          { name: 'Choose Action', text: 'Select Resize, Compress, Convert, or Crop.' },
          { name: 'Adjust Options', text: 'Customize dimensions, target file size, or format.' },
          { name: 'Download', text: 'Instantly download your watermark-free result.' },
        ]}
      />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            ⚡ WebAssembly & Canvas Engine
          </span>
          <PrivacyBadge />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Free Online Image Toolkit
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Resize, compress, convert, and crop your photos in seconds. Processed entirely inside your browser —{' '}
          <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
            your images never touch a server.
          </strong>
        </p>

        {/* Above-the-fold Interactive Studio */}
        <div className="mt-8">
          {/* Tool Selector Tabs */}
          <div className="flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-sm max-w-xl mx-auto mb-6">
            {[
              { id: 'resize', label: 'Resize', icon: Maximize2 },
              { id: 'compress', label: 'Compress', icon: FileArchive },
              { id: 'convert', label: 'Convert', icon: RefreshCw },
              { id: 'crop', label: 'Crop', icon: Crop },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setProcessedResult(null);
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Workspace */}
          {processedResult && imageState ? (
            <DownloadCard
              result={processedResult}
              original={imageState}
              onReset={() => setProcessedResult(null)}
            />
          ) : (
            <div className="space-y-6 text-left">
              <ImageUploader
                imageState={imageState}
                onImageLoaded={(img) => {
                  setImageState(img);
                  setProcessedResult(null);
                }}
                title={`Upload Image to ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                subtitle="Select, drop your file, or press Ctrl+V to paste from clipboard"
              />

              {imageState && (
                <div>
                  {activeTab === 'resize' && (
                    <ResizeTool imageState={imageState} onResult={setProcessedResult} />
                  )}
                  {activeTab === 'compress' && (
                    <CompressTool imageState={imageState} onResult={setProcessedResult} />
                  )}
                  {activeTab === 'convert' && (
                    <ConvertTool imageState={imageState} onResult={setProcessedResult} />
                  )}
                  {activeTab === 'crop' && (
                    <CropTool imageState={imageState} onResult={setProcessedResult} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CLS-Safe Ad Slot */}
      <AdBanner slot="middle" />

      {/* Why Choose Us Feature Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Maximum Privacy & Lightning Speed
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Why millions of creators, developers, and students switch from legacy upload tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              100% Client-Side Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sensitive documents, ID photos, and personal pictures never leave your computer or phone. All pixel operations execute in local device RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Zero Upload Waiting Time
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Skip slow internet uploads! Processing runs on your local GPU/CPU hardware via HTML5 Canvas, completing in milliseconds rather than minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Target File Size Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Need a photo under 20KB or 50KB for a government portal? Our binary search compression algorithm hits exact kilobyte limits automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Competitor Analysis Matrix (How We Compare) */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How We Compare
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Privacy-first image tools that run entirely in your browser.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  <th className="pb-4 font-bold w-1/3">FEATURE</th>
                  <th className="pb-4 font-bold text-blue-600 dark:text-blue-400 w-1/3">IMAGERESIZENOW</th>
                  <th className="pb-4 font-bold text-slate-400 dark:text-slate-500 w-1/3">OTHER COMPETITORS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Processing</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">100% in your browser</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Uploaded to servers</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Privacy</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">Never leaves your device</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Kept on their servers</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Modern Formats</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">WebP, AVIF &amp; HEIC</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Often limited</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Target File Size</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">Exact: 20KB, 50KB, 100KB</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Quality % slider only</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Sign-up &amp; Upsells</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">No account, no watermark</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Sign-ups, premium pushes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Programmatic Landing Pages Hub */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Explore Popular Tools and Dedicated Dimensions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Social Media Sizes
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/resize/1080x1080" className="hover:text-blue-500 flex items-center justify-between">
                  <span>1080×1080 Instagram Post</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/resize/1200x630" className="hover:text-blue-500 flex items-center justify-between">
                  <span>1200×630 Facebook / OG</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/preset/youtube-thumbnail" className="hover:text-blue-500 flex items-center justify-between">
                  <span>1280×720 YouTube Thumbnail</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/resize/1920x1080" className="hover:text-blue-500 flex items-center justify-between">
                  <span>1920×1080 Full HD Landscape</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Target File Compression
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/compress/20kb" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Compress Image to 20 KB</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/compress/50kb" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Compress Image to 50 KB</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/compress/100kb" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Compress Image to 100 KB</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/compress/200kb" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Compress Image to 200 KB</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Format Converters
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/convert/png-to-webp" className="hover:text-blue-500 flex items-center justify-between">
                  <span>PNG to WebP (Alpha)</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/convert/jpg-to-png" className="hover:text-blue-500 flex items-center justify-between">
                  <span>JPG to Lossless PNG</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/convert/heic-to-jpg" className="hover:text-blue-500 flex items-center justify-between">
                  <span>iPhone HEIC to JPG</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/convert/jpg-to-avif" className="hover:text-blue-500 flex items-center justify-between">
                  <span>JPG to Next-Gen AVIF</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Official Exams & ID
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li>
                <Link href="/resize/passport-photo" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Passport Photo 600×600</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/resize/exam-photo" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Exam Photo 200×230 px</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/preset/exam-signature" className="hover:text-blue-500 flex items-center justify-between">
                  <span>Exam Signature 140×60</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/resize/500x500" className="hover:text-blue-500 flex items-center justify-between">
                  <span>500×500 Product / Avatar</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Card */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrivacyCard />
      </section>

      {/* FAQs Section */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
