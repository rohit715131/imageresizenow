import { MetadataRoute } from 'next';
import { RESIZE_PAGES, COMPRESS_PAGES, CONVERT_PAGES, PRESET_PAGES } from '@/lib/programmatic-data';
import { GUIDES } from '@/lib/guides-data';
import { PDF_PAGES } from '@/features/pdf-tools/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imageresizenow.com';
  const now = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resize`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/crop`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Programmatic Resize pages
  const resizeRoutes: MetadataRoute.Sitemap = Object.keys(RESIZE_PAGES).map((slug) => ({
    url: `${baseUrl}/resize/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Compress pages
  const compressRoutes: MetadataRoute.Sitemap = Object.keys(COMPRESS_PAGES).map((slug) => ({
    url: `${baseUrl}/compress/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Convert pages
  const convertRoutes: MetadataRoute.Sitemap = Object.keys(CONVERT_PAGES).map((slug) => ({
    url: `${baseUrl}/convert/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Preset pages
  const presetRoutes: MetadataRoute.Sitemap = Object.keys(PRESET_PAGES).map((slug) => ({
    url: `${baseUrl}/preset/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Guides & Articles
  const guideRoutes: MetadataRoute.Sitemap = Object.keys(GUIDES).map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // PDF Tools and Variant pages
  const pdfRoutes: MetadataRoute.Sitemap = Object.values(PDF_PAGES).map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: page.slug === 'image-to-pdf' || page.slug === 'compress-pdf' ? 0.95 : 0.85,
  }));

  return [
    ...staticRoutes,
    ...resizeRoutes,
    ...compressRoutes,
    ...convertRoutes,
    ...presetRoutes,
    ...guideRoutes,
    ...pdfRoutes,
  ];
}
