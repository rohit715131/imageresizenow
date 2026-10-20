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
  FileText,
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
  Cpu,
  HardDrive,
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
        'Unlike cloud image converters that upload your photos to remote servers, our toolkit executes all logic locally inside your browser memory using HTML5 Canvas and WebAssembly. Your photos, sensitive documents, and signatures never travel across the internet or get stored on any disk.',
    },
    {
      question: 'Why do you show ads if the site is private? Do ads track my images?',
      answer:
        'We show standard display ads to keep all tools 100% free with no account or subscription requirements. Ad networks use standard web cookies to deliver and measure ads, but they run in an isolated web environment and never have access to, cannot view, and cannot intercept any images or documents you process.',
    },
    {
      question: 'How do I compress an image to an exact size like 20 KB or 50 KB?',
      answer:
        'Select the "Compress" tab, switch to "Target File Size Mode", and select 20 KB, 50 KB, 100 KB, or enter any custom target. Our iterative binary-search algorithm adjusts image quality and dimensions to guarantee the output file stays strictly under your target while retaining maximum visual clarity.',
    },
    {
      question: 'Which image and document formats are supported?',
      answer:
        'You can import and process JPG, PNG, WebP, AVIF, HEIC (Apple iPhone photos), GIF, and BMP images. You can also convert photos to PDF or compress multi-page PDF documents.',
    },
    {
      question: 'Can I use these image tools offline or on slow internet connections?',
      answer:
        'Yes. Once the page has loaded in your browser, all image processing occurs using your local device CPU and GPU. You do not need to wait for heavy multi-megabyte uploads, making it fast even on spotty mobile connections or offline.',
    },
    {
      question: 'Is there any file size limit, watermark, or daily quota?',
      answer:
        'No. Because processing is performed using your local device memory rather than expensive server clusters, there are no artificial file size limits, no daily conversion caps, and no watermarks added to your downloaded images.',
    },
    {
      question: 'How does client-side format conversion differ from cloud converters?',
      answer:
        'Traditional cloud converters send your files to remote servers where they enter a processing queue. Client-side conversion decodes the image directly into browser canvas memory and re-encodes it into your chosen format (such as WebP or PNG) in milliseconds without any network latency.',
    },
    {
      question: 'How do I convert iPhone HEIC photos to JPG or PNG?',
      answer:
        'Select the "Convert" tab or navigate to /convert/heic-to-jpg, upload your .heic or .heif file, and select JPG or PNG as the target format. The tool decodes the container and produces a standard image compatible with Windows, Android, and web portals.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <JsonLd
        type="all"
        name="Resize, Compress, and Convert Images Online - ImageResizeNow"
        description="Free, private client-side image editor to resize, compress, convert, and crop images directly in your browser. Zero server uploads."
        url="https://imageresizenow.com"
        faqs={homeFaqs}
        steps={[
          { name: 'Upload Image', text: 'Select, drag and drop, or paste an image from your clipboard.' },
          { name: 'Choose Action', text: 'Select Resize, Compress, Convert, or Crop.' },
          { name: 'Adjust Options', text: 'Customize dimensions, target file size (e.g. 20 KB, 50 KB), or format.' },
          { name: 'Download', text: 'Instantly download your watermark-free result.' },
        ]}
      />

      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span aria-hidden="true">⚡</span> WebAssembly &amp; Canvas Engine
          </span>
          <PrivacyBadge />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Resize, Compress, and Convert Images Online
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Resize, compress, convert, and crop your photos in seconds. Processed entirely inside your browser —{' '}
          <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
            your images never touch a server.
          </strong>
        </p>

        {/* Above-the-fold Interactive Studio */}
        <div className="mt-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            In-Browser Image Studio
          </h2>

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
                subtitle="Select, drop your file, or paste from clipboard"
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

      {/* Discreet Advertisement Slot */}
      <AdBanner slot="middle" />

      {/* Architectural Advantages Feature Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Built for Maximum Privacy &amp; Lightning Speed
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Why users prefer client-side processing over cloud upload tools.
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
              Skip slow internet uploads. Processing runs on your local GPU/CPU hardware via HTML5 Canvas, completing in milliseconds rather than minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Target File Size Precision
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Need a photo under 20 KB or 50 KB for an application portal? Our binary-search compression algorithm hits exact kilobyte limits automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Comparison Matrix */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client-Side Processing vs. Cloud Converters
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            How in-browser HTML5 Canvas algorithms compare with traditional upload-based services.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  <th className="pb-4 font-bold w-1/3">FEATURE</th>
                  <th className="pb-4 font-bold text-blue-600 dark:text-blue-400 w-1/3">IMAGERESIZENOW (CLIENT-SIDE)</th>
                  <th className="pb-4 font-bold text-slate-400 dark:text-slate-500 w-1/3">SERVER-BASED UPLOAD SERVICES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">File Location</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">Never leaves your device RAM</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Transferred across internet to remote server</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Execution Engine</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">Local HTML5 Canvas &amp; WebAssembly</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Remote backend server queues</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Supported Formats</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">JPG, PNG, WebP, AVIF, HEIC, GIF</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Usually limited to JPG and PNG</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Target Kilobyte Mode</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">Exact limits (20 KB, 50 KB, 100 KB)</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Quality percentage slider only</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 dark:text-white">Usage &amp; Accounts</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">No login, no watermark, unlimited</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">Registration or paid plans often required</td>
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
              Official Exams &amp; ID
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

      {/* PDF Tools Feature Showcase */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/60 dark:border-blue-900/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                New Tools
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                Client-Side PDF Document Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Convert images to single-page PDFs or compress heavy PDF documents without server uploads.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                100% In-Browser Privacy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/image-to-pdf"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Image to PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Convert JPG, PNG, and WebP photos into clean A4 or Letter PDFs.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Convert to PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/jpg-to-pdf"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  JPG to PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Embed JPEG camera pictures losslessly into standardized PDFs.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>JPG to PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/compress-pdf"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold mb-3">
                  <FileArchive className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Compress PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Reduce heavy multi-page PDFs with Medium, High, or Low presets.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                <span>Compress PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/compress-pdf-to-100kb"
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
                  <FileArchive className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Compress PDF to 100 KB
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Target strict 100 KB and 200 KB ceilings for job and admission portals.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Compress PDF to 100 KB</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Architecture Card */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrivacyCard />
      </section>

      {/* Educational Content & Guides Section */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Article 1: How In-Browser Processing Works */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Cpu className="w-4 h-4" />
            <span>Behind the Technology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How Client-Side In-Browser Image Processing Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Most web-based image manipulation tools act as simple relays: they take your file, upload it over the internet to a backend cloud server, run command-line tools like ImageMagick or Sharp, and then send a download link back. While effective, this process introduces privacy vulnerabilities, consumes internet bandwidth, and introduces upload queue latency.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ImageResizeNow takes a modern, privacy-first approach. By leveraging the browser&apos;s native HTML5 Canvas API and WebAssembly, all image decoding, bicubic interpolation downscaling, quantization, and compression happen directly within your browser&apos;s sandboxed memory space. Because your file is never transmitted across the network, processing takes only a fraction of a second and your confidential photos remain completely private on your device.
          </p>
        </div>

        {/* Article 2: How to choose target size */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sliders className="w-4 h-4" />
            <span>Target Size Optimization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How to Choose the Right Target File Size (20 KB, 50 KB, 100 KB)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Online portals for government examinations (such as SSC, UPSC, and state PSCs), job applications, and visa forms often enforce rigid file size thresholds. Uploading an image even 1 KB above the limit triggers an immediate validation failure:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Under 20 KB</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mandated for digital signatures, thumbprints, and small portal thumbnails where only minimal dimensions (e.g. 140×60 px) are needed.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Under 50 KB</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The standard ceiling for passport photographs, admit cards, and student ID cards. Balances facial clarity with low bandwidth usage.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Under 100 KB / 200 KB</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Recommended for document scans, certificates, resumes, and web illustrations where sharp text readability is essential.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our Target File Size mode uses a binary-search algorithm over JPEG/WebP quantization tables to guarantee your file meets these strict portal limits without multiple manual export attempts.
          </p>
        </div>

        {/* Article 3: Format comparison */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <RefreshCw className="w-4 h-4" />
            <span>Format Comparison</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Which Image Format Should You Use? (JPG vs PNG vs WebP vs AVIF vs GIF)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">JPEG / JPG</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Universal compatibility across every device and browser. Best choice for photographs, official forms, and social media.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">PNG</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lossless raster format supporting transparent alpha channels. Ideal for brand logos, icons, and screenshots with crisp text.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">WebP</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google&apos;s modern web format providing 25–35% smaller file sizes than JPG with full transparency support. Perfect for web design.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">AVIF</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Next-generation open video consortium codec delivering extreme compression efficiency for modern browsers.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">GIF</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Legacy bitmap format. Use our converter to resize static frames or convert old GIFs to modern WebP or PNG.
              </p>
            </div>
          </div>
        </div>
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
                  } px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
