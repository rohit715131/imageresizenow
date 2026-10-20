import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Heart, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                IR
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Image<span className="text-blue-600 dark:text-blue-400">Resize</span>Now
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-4">
              Free, private in-browser image optimization toolkit. Resize, compress, convert, and crop images directly inside your browser without uploading to any remote server.
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Uploads:</strong> All WebAssembly and Canvas algorithms run 100% client-side on your device.
              </span>
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Image Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resize" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/compress" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/convert" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Convert Formats
                </Link>
              </li>
              <li>
                <Link href="/crop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Crop & Rotate
                </Link>
              </li>
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              PDF Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/image-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/png-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PNG to PDF
                </Link>
              </li>
              <li>
                <Link href="/photo-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Photo to PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf-to-100kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress PDF to 100 KB
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf-to-200kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress PDF to 200 KB
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf-to-500kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress PDF to 500 KB
                </Link>
              </li>
              <li>
                <Link href="/reduce-pdf-size" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Reduce PDF Size
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Sizes */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Popular Sizes
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resize/1080x1080" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  1080×1080 Square
                </Link>
              </li>
              <li>
                <Link href="/resize/1200x630" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  1200×630 OG Banner
                </Link>
              </li>
              <li>
                <Link href="/resize/1280x720" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  1280×720 YouTube
                </Link>
              </li>
              <li>
                <Link href="/resize/1920x1080" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  1920×1080 Full HD
                </Link>
              </li>
              <li>
                <Link href="/resize/passport-photo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Passport Photo (2×2" / 600×600 px)
                </Link>
              </li>
              <li>
                <Link href="/resize/exam-photo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Govt Exam 200×230
                </Link>
              </li>
              <li>
                <Link href="/resize/exam-signature" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Exam Signature 140×60
                </Link>
              </li>
            </ul>
          </div>

          {/* Compress Targets */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Compress
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/compress/20kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress to 20 KB
                </Link>
              </li>
              <li>
                <Link href="/compress/50kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress to 50 KB
                </Link>
              </li>
              <li>
                <Link href="/compress/100kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress to 100 KB
                </Link>
              </li>
              <li>
                <Link href="/compress/200kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress to 200 KB
                </Link>
              </li>
              <li>
                <Link href="/compress/1mb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress to 1 MB
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Guides */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Formats & Guides
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/convert/png-to-webp" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PNG to WebP
                </Link>
              </li>
              <li>
                <Link href="/convert/heic-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  iPhone HEIC to JPG
                </Link>
              </li>
              <li>
                <Link href="/convert/jpg-to-avif" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  JPG to AVIF
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-blue-600 dark:text-blue-400">
                  Optimization Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sitemap (XML)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ImageResizeNow. Free online image toolkit with client-side privacy.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> End-to-end device privacy
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Fast Edge Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
