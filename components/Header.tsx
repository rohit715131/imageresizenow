'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  Sun,
  Moon,
  Menu,
  X,
  Maximize2,
  FileArchive,
  RefreshCw,
  Crop,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  FileText,
} from 'lucide-react';

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const resizePresets = [
    { name: '1080×1080 Square (Instagram)', href: '/resize/1080x1080' },
    { name: '1200×630 Social Share', href: '/resize/1200x630' },
    { name: '1280×720 YouTube Thumbnail', href: '/preset/youtube-thumbnail' },
    { name: 'Passport Photo 600×600', href: '/resize/passport-photo' },
    { name: 'Govt Exam 200×230', href: '/resize/exam-photo' },
  ];

  const compressPresets = [
    { name: 'Compress to under 20 KB', href: '/compress/20kb' },
    { name: 'Compress to under 50 KB', href: '/compress/50kb' },
    { name: 'Compress to under 100 KB', href: '/compress/100kb' },
    { name: 'Compress to under 200 KB', href: '/compress/200kb' },
    { name: 'Compress to under 1 MB', href: '/compress/1mb' },
  ];

  const convertPresets = [
    { name: 'PNG to WebP', href: '/convert/png-to-webp' },
    { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
    { name: 'PNG to JPG', href: '/convert/png-to-jpg' },
    { name: 'iPhone HEIC to JPG', href: '/convert/heic-to-jpg' },
    { name: 'JPG to AVIF', href: '/convert/jpg-to-avif' },
  ];

  const pdfTools = {
    imageToPdf: [
      { name: 'Image to PDF (All)', href: '/image-to-pdf' },
      { name: 'JPG to PDF', href: '/jpg-to-pdf' },
      { name: 'PNG to PDF', href: '/png-to-pdf' },
      { name: 'Photo to PDF', href: '/photo-to-pdf' },
    ],
    compressPdf: [
      { name: 'Compress PDF', href: '/compress-pdf' },
      { name: 'Compress to 100 KB', href: '/compress-pdf-to-100kb' },
      { name: 'Compress to 200 KB', href: '/compress-pdf-to-200kb' },
      { name: 'Reduce PDF Size', href: '/reduce-pdf-size' },
    ],
  };

  const isResizeActive = pathname === '/resize' || pathname.startsWith('/resize/') || pathname.startsWith('/preset/');
  const isCompressActive = pathname === '/compress' || pathname.startsWith('/compress/');
  const isConvertActive = pathname === '/convert' || pathname.startsWith('/convert/');
  const isCropActive = pathname === '/crop';
  const isPdfActive = pathname.includes('pdf');
  const isGuidesActive = pathname.startsWith('/guides');

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-base font-extrabold tracking-tighter">IR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Image<span className="text-blue-600 dark:text-blue-400">Resize</span>Now
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Free Client-Side Toolkit</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {/* 1. Resize Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('resize')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={`inline-flex items-center rounded-xl transition-colors whitespace-nowrap ${
                  isResizeActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Link href="/resize" className="px-2.5 py-2 flex items-center gap-1.5 whitespace-nowrap">
                  <Maximize2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Resize</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('resize', e)}
                  aria-label="Toggle Resize Menu"
                  aria-expanded={openDropdown === 'resize'}
                  className="pr-2 py-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'resize' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {openDropdown === 'resize' && (
                <div className="absolute top-full left-0 pt-1.5 w-60 z-50">
                  <div className="py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
                    <Link
                      href="/resize"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-b border-slate-100 dark:border-slate-800 mb-1"
                    >
                      All Resize Tools & Presets →
                    </Link>
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Dimensions
                    </div>
                    {resizePresets.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Compress Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('compress')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={`inline-flex items-center rounded-xl transition-colors whitespace-nowrap ${
                  isCompressActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Link href="/compress" className="px-2.5 py-2 flex items-center gap-1.5 whitespace-nowrap">
                  <FileArchive className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Compress</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('compress', e)}
                  aria-label="Toggle Compress Menu"
                  aria-expanded={openDropdown === 'compress'}
                  className="pr-2 py-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'compress' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {openDropdown === 'compress' && (
                <div className="absolute top-full left-0 pt-1.5 w-56 z-50">
                  <div className="py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
                    <Link
                      href="/compress"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-b border-slate-100 dark:border-slate-800 mb-1"
                    >
                      Image Compressor Tool →
                    </Link>
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Target File Sizes
                    </div>
                    {compressPresets.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Convert Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('convert')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={`inline-flex items-center rounded-xl transition-colors whitespace-nowrap ${
                  isConvertActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Link href="/convert" className="px-2.5 py-2 flex items-center gap-1.5 whitespace-nowrap">
                  <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Convert</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('convert', e)}
                  aria-label="Toggle Convert Menu"
                  aria-expanded={openDropdown === 'convert'}
                  className="pr-2 py-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'convert' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {openDropdown === 'convert' && (
                <div className="absolute top-full left-0 pt-1.5 w-52 z-50">
                  <div className="py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
                    <Link
                      href="/convert"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-b border-slate-100 dark:border-slate-800 mb-1"
                    >
                      All Image Converters →
                    </Link>
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Formats
                    </div>
                    {convertPresets.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Crop (Direct Link) */}
            <Link
              href="/crop"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isCropActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Crop className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Crop</span>
            </Link>

            {/* 5. PDF Tools Suite Menu */}
            <div
              className="relative shrink-0"
              onMouseEnter={() => setOpenDropdown('pdf')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={`inline-flex items-center rounded-xl transition-colors whitespace-nowrap ${
                  isPdfActive
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Link href="/image-to-pdf" className="px-2.5 py-2 flex items-center gap-1.5 whitespace-nowrap">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span>PDF Tools</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => toggleDropdown('pdf', e)}
                  aria-label="Toggle PDF Tools Menu"
                  aria-expanded={openDropdown === 'pdf'}
                  className="pr-2 py-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'pdf' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {openDropdown === 'pdf' && (
                <div className="absolute top-full left-0 pt-1.5 w-56 z-50">
                  <div className="py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
                    <Link
                      href="/image-to-pdf"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-b border-slate-100 dark:border-slate-800 mb-1"
                    >
                      All PDF Tools →
                    </Link>
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Image to PDF
                    </div>
                    {pdfTools.imageToPdf.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}

                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Compress PDF
                    </div>
                    {pdfTools.compressPdf.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Guides Link */}
            <Link
              href="/guides"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isGuidesActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Guides</span>
            </Link>
          </nav>

          {/* Right Action Icons: Privacy Badge, Dark Mode, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Client-Side</span>
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Main Tool Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/resize"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <Maximize2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Resize</span>
            </Link>
            <Link
              href="/compress"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <FileArchive className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Compress</span>
            </Link>
            <Link
              href="/convert"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Convert</span>
            </Link>
            <Link
              href="/crop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <Crop className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Crop</span>
            </Link>
            <Link
              href="/image-to-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <FileText className="w-4 h-4 text-red-500 shrink-0" />
              <span>Image to PDF</span>
            </Link>
            <Link
              href="/compress-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <FileText className="w-4 h-4 text-red-500 shrink-0" />
              <span>Compress PDF</span>
            </Link>
          </div>

          {/* Popular Shortcuts */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Popular Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <Link
                href="/resize/1080x1080"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                1080×1080 Instagram
              </Link>
              <Link
                href="/resize/passport-photo"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                Passport Photo 2×2"
              </Link>
              <Link
                href="/compress/20kb"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                Compress to 20 KB
              </Link>
              <Link
                href="/compress/50kb"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                Compress to 50 KB
              </Link>
              <Link
                href="/convert/png-to-webp"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                PNG to WebP
              </Link>
              <Link
                href="/convert/heic-to-jpg"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                iPhone HEIC to JPG
              </Link>
              <Link
                href="/jpg-to-pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-red-500"
              >
                JPG to PDF
              </Link>
              <Link
                href="/compress-pdf-to-100kb"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-red-500"
              >
                Compress PDF to 100 KB
              </Link>
            </div>
          </div>

          {/* Footer links in drawer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Optimization Guides →
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
