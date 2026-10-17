'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
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
} from 'lucide-react';

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navTools = [
    { name: 'Resize', href: '/resize', icon: Maximize2, desc: 'By pixel, % or preset' },
    { name: 'Compress', href: '/compress', icon: FileArchive, desc: 'Target 20KB, 50KB, 100KB' },
    { name: 'Convert', href: '/convert', icon: RefreshCw, desc: 'WebP, AVIF, JPG, PNG' },
    { name: 'Crop', href: '/crop', icon: Crop, desc: 'Free & fixed aspect ratio' },
  ];

  const popularPresets = [
    { name: '1080×1080 Square', href: '/resize/1080x1080' },
    { name: '1200×630 Social Share', href: '/resize/1200x630' },
    { name: 'YouTube 1280×720', href: '/preset/youtube-thumbnail' },
    { name: 'Passport 600×600', href: '/resize/passport-photo' },
    { name: 'Govt Exam 200×230', href: '/resize/exam-photo' },
  ];

  const popularCompress = [
    { name: 'Compress to 20 KB', href: '/compress/20kb' },
    { name: 'Compress to 50 KB', href: '/compress/50kb' },
    { name: 'Compress to 100 KB', href: '/compress/100kb' },
    { name: 'Compress to 200 KB', href: '/compress/200kb' },
    { name: 'Compress to 1 MB', href: '/compress/1mb' },
  ];

  const popularFormats = [
    { name: 'PNG to WebP', href: '/convert/png-to-webp' },
    { name: 'JPG to PNG', href: '/convert/jpg-to-png' },
    { name: 'PNG to JPG', href: '/convert/png-to-jpg' },
    { name: 'HEIC to JPG', href: '/convert/heic-to-jpg' },
    { name: 'JPG to AVIF', href: '/convert/jpg-to-avif' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            {/* Primary Tools */}
            {navTools.map((tool) => {
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <tool.icon className="w-4 h-4 text-blue-500" />
                  <span>{tool.name}</span>
                </Link>
              );
            })}

            {/* Presets Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('presets')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <span>Sizes</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {openDropdown === 'presets' && (
                <div className="absolute top-full left-0 w-52 py-2 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40">
                  {popularPresets.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Compress Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('compress')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <span>Compress</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {openDropdown === 'compress' && (
                <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10">
                  {popularCompress.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Convert Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('convert')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <span>Convert</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {openDropdown === 'convert' && (
                <div className="absolute top-full left-0 w-44 py-2 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10">
                  {popularFormats.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Guides Link */}
            <Link
              href="/guides"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/guides')
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Guides</span>
            </Link>
          </nav>

          {/* Right Action Icons: Dark Mode & Privacy Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
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

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white"
              >
                <tool.icon className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Popular Tools & Sizes
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
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
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500 font-semibold text-blue-500"
              >
                Optimization Guides
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-600 dark:text-slate-300 hover:text-blue-500"
              >
                Contact & Feedback
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
