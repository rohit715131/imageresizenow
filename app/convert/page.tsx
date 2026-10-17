import { Metadata } from 'next';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ProgrammaticPageData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Convert Image Online Free - WebP, JPG, PNG, AVIF, HEIC',
  description:
    'Free online image converter. Convert between WebP, JPG, PNG, AVIF, and iPhone HEIC formats with transparent background handling. 100% private in your browser.',
  alternates: {
    canonical: 'https://imageresizenow.com/convert',
  },
};

const pageData: ProgrammaticPageData = {
  slug: 'convert',
  title: 'Free Online Image Converter',
  metaDescription:
    'Convert between WebP, JPG, PNG, AVIF, and iPhone HEIC formats with transparent background handling. 100% private.',
  h1: 'Convert Image Online Free',
  toolType: 'convert',
  badge: 'Multi-Format Converter',
  description:
    'Convert images between modern WebP, AVIF, JPG, and PNG formats. Includes automatic alpha background filling for transparent PNG to JPEG conversions.',
  howToSteps: [
    { name: 'Upload Source File', text: 'Select, drag and drop, or paste (Ctrl+V) your image.' },
    { name: 'Select Target Format', text: 'Choose between WebP, JPG, PNG, or AVIF.' },
    { name: 'Configure Quality & Background', text: 'Adjust compression quality and background color if converting transparent files.' },
    { name: 'Download Converted Image', text: 'Click "Convert Image" and download your converted file instantly.' },
  ],
  faqs: [
    {
      question: 'Which image format should I convert my photos to for the web?',
      answer:
        'WebP is currently the recommended standard for the web. It reduces file sizes by 30% compared to JPG while retaining full alpha transparency support and 97%+ browser compatibility.',
    },
    {
      question: 'Can I convert Apple iPhone HEIC photos to JPG?',
      answer:
        'Yes! Our converter supports HEIC photos taken on modern iPhones and iPads, converting them into universal JPEG files that open on Windows PCs and legacy devices.',
    },
    {
      question: 'What happens to transparency when converting PNG to JPG?',
      answer:
        'Because JPEG does not support transparency, our converter composites the transparent areas over a clean white background (or your custom chosen color) to prevent black box artifacts.',
    },
    {
      question: 'Is AVIF better than WebP?',
      answer:
        'AVIF provides approximately 20% greater compression efficiency than WebP. It is supported by all modern versions of Chrome, Safari, Edge, and Firefox.',
    },
  ],
  contentSections: [
    {
      title: 'Modernizing Legacy Web Assets to Next-Gen Formats',
      content:
        'Serving old PNG or uncompressed JPG files slows down web pages and penalizes your site on search engines. Modern formats like WebP and AVIF utilize advanced intra-frame video compression techniques to cut bandwidth consumption in half while looking identical to viewers.',
    },
    {
      title: 'Lossless vs. Lossy Conversion Options',
      content:
        'When you need pristine pixel preservation for technical diagrams, UI mockups, or logo typography, converting to PNG ensures lossless fidelity. For photography and general illustrations, WebP or JPEG provides optimal lightweight files.',
    },
  ],
  relatedPages: [
    { title: 'Convert PNG to WebP', href: '/convert/png-to-webp' },
    { title: 'Convert iPhone HEIC to JPG', href: '/convert/heic-to-jpg' },
    { title: 'Convert JPG to PNG', href: '/convert/jpg-to-png' },
    { title: 'Compress to under 100KB', href: '/compress/100kb' },
  ],
};

export default function ConvertPage() {
  return (
    <ToolPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Tools', href: '/convert' },
        { name: 'Convert Image', href: '/convert' },
      ]}
    />
  );
}
