import React from 'react';
import { FAQItem } from '@/lib/types';

interface JsonLdProps {
  type: 'software' | 'faq' | 'howto' | 'breadcrumbs' | 'all';
  name?: string;
  description?: string;
  url?: string;
  faqs?: FAQItem[];
  steps?: { name: string; text: string }[];
  breadcrumbs?: { name: string; item: string }[];
}

export function JsonLd({
  type,
  name = 'Free Online Image Toolkit',
  description = 'Free, private client-side image editor to resize, compress, convert, and crop images directly in your browser.',
  url = 'https://imageresizenow.com',
  faqs = [],
  steps = [],
  breadcrumbs = [],
}: JsonLdProps) {
  const schemas: object[] = [];

  // WebSite Schema with brand alternateNames for Google
  if (type === 'all' && url === 'https://imageresizenow.com') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ImageResizeNow',
      alternateName: ['ResizeNow', 'Image Resize Now', 'ResizeNow Online', 'Resize Now'],
      url: 'https://imageresizenow.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://imageresizenow.com/resize?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }

  // SoftwareApplication / WebApplication Schema
  if (type === 'software' || type === 'all') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': ['SoftwareApplication', 'WebApplication'],
      name: name,
      operatingSystem: 'All',
      applicationCategory: 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description: description,
      url: url,
      featureList: [
        'Client-side image resizing by pixels, percent, and social presets',
        'Intelligent image compression with target file size mode (20 KB, 50 KB, 100 KB)',
        'Next-gen image conversion for WebP, AVIF, PNG, JPG, and HEIC',
        'Visual aspect ratio crop and rotation',
        '100% private in-browser processing with zero server uploads',
      ],
      browserRequirements: 'Requires JavaScript and HTML5 Canvas API support',
    });
  }

  // HowTo Schema
  if ((type === 'howto' || type === 'all') && steps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${name}`,
      description: description,
      step: steps.map((s, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  // FAQPage Schema
  if ((type === 'faq' || type === 'all') && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // Breadcrumbs Schema
  if ((type === 'breadcrumbs' || type === 'all') && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
