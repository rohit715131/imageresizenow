import { MetadataRoute } from 'next';
import { RESIZE_PAGES, COMPRESS_PAGES, CONVERT_PAGES } from '@/lib/programmatic-data';
import { GUIDES } from '@/lib/guides-data';
import { PDF_PAGES } from '@/features/pdf-tools/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imageresizenow.com';

  // Stable dates reflecting real content updates rather than build timestamps
  const dateRecent = new Date('2026-10-21T00:00:00Z');
  const dateCore = new Date('2026-10-20T00:00:00Z');
  const datePdfLaunch = new Date('2026-10-19T00:00:00Z');
  const dateInitialProgrammatic = new Date('2026-10-18T00:00:00Z');

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: dateRecent,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resize`,
      lastModified: dateCore,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress`,
      lastModified: dateCore,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: dateCore,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/crop`,
      lastModified: dateCore,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: dateRecent,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: dateCore,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: dateCore,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: dateCore,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: dateCore,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Programmatic Resize pages (all unified under /resize/)
  const resizeRoutes: MetadataRoute.Sitemap = Object.keys(RESIZE_PAGES).map((slug) => ({
    url: `${baseUrl}/resize/${slug}`,
    lastModified: slug === 'exam-signature' ? dateRecent : dateInitialProgrammatic,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Compress pages (including 1kb, 5kb, 10kb, 25kb, 40kb)
  const compressRoutes: MetadataRoute.Sitemap = Object.keys(COMPRESS_PAGES).map((slug) => ({
    url: `${baseUrl}/compress/${slug}`,
    lastModified: ['1kb', '5kb', '10kb', '25kb', '40kb'].includes(slug) ? dateRecent : dateInitialProgrammatic,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Convert pages
  const convertRoutes: MetadataRoute.Sitemap = Object.keys(CONVERT_PAGES).map((slug) => ({
    url: `${baseUrl}/convert/${slug}`,
    lastModified: dateInitialProgrammatic,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Guides & Articles (each uses its real publication date)
  const guideRoutes: MetadataRoute.Sitemap = Object.values(GUIDES).map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // PDF Tools and Variant pages
  const pdfRoutes: MetadataRoute.Sitemap = Object.values(PDF_PAGES).map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: datePdfLaunch,
    changeFrequency: 'weekly',
    priority: page.slug === 'image-to-pdf' || page.slug === 'compress-pdf' ? 0.95 : 0.85,
  }));

  return [
    ...staticRoutes,
    ...resizeRoutes,
    ...compressRoutes,
    ...convertRoutes,
    ...guideRoutes,
    ...pdfRoutes,
  ];
}
