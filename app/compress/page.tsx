import { Metadata } from 'next';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ProgrammaticPageData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Compress Image Online Free - Reduce File Size in KB & MB',
  description:
    'Compress JPG, PNG, and WebP images online free. Target specific file sizes (20KB, 50KB, 100KB, 200KB) with live before/after preview. 100% private in browser.',
  keywords: [
    'image compressor',
    'image compressor to 50kb',
    'image compressor to 20kb',
    'image compressor to 10kb',
    'image compressor to 5kb',
    'image compressor to 1kb',
    'compress image to 25kb',
    'jpg compress',
    'image resize in kb',
    'resize image in kb',
  ],
  alternates: {
    canonical: 'https://imageresizenow.com/compress',
  },
};

const pageData: ProgrammaticPageData = {
  slug: 'compress',
  title: 'Free Online Image Compressor',
  metaDescription:
    'Compress JPG, PNG, and WebP images online free. Target specific file sizes (20KB, 50KB, 100KB) with live before/after preview.',
  h1: 'Compress Image Online Free',
  toolType: 'compress',
  badge: 'Smart Image Compressor',
  description:
    'Reduce photo file weights by up to 90% without visible quality loss. Choose between exact Target File Size mode (e.g. 20KB, 50KB, 100KB) or fine-grained Quality Slider mode.',
  howToSteps: [
    { name: 'Upload Photo', text: 'Select, drag and drop, or paste (Ctrl+V) the image you wish to compress.' },
    { name: 'Choose Mode', text: 'Select "Target File Size Mode" for portal limits or "Quality Slider Mode".' },
    { name: 'Set Desired Weight', text: 'Pick a popular preset (20KB, 50KB, 100KB, 200KB) or enter custom KB.' },
    { name: 'Download Compressed File', text: 'Click "Compress Image" and download your lightweight image with zero watermarks.' },
  ],
  faqs: [
    {
      question: 'How does Target File Size mode work?',
      answer:
        'Our engine executes a fast binary-search algorithm over browser compression matrices in real time, finding the optimal balance of quality and downscaling to fit strictly under your chosen KB limit.',
    },
    {
      question: 'Can I compress photos for government and exam application forms?',
      answer:
        'Yes! Government portals frequently require photos under 50KB and signatures under 20KB. Our presets are specifically designed to comply with these portal validators.',
    },
    {
      question: 'Will compressing my images make them look blurry?',
      answer:
        'Not with typical settings. By eliminating imperceptible high-frequency noise and utilizing modern quantization tables, images compressed to 80% quality look identical to the naked eye.',
    },
    {
      question: 'Are my confidential documents uploaded to a server?',
      answer:
        'Never. All compression runs in client-side memory using HTML5 Canvas. Your sensitive documents, IDs, and financial scans remain completely private on your device.',
    },
  ],
  contentSections: [
    {
      title: 'Targeting Exact Kilobyte Caps Without Trial and Error',
      content:
        'Almost everyone has encountered the frustration of uploading an image to an online portal only to be blocked by an error saying "File exceeds 50 KB". With standard image editors, you have to guess the quality level, export, check the file size in Windows Explorer, and repeat. Our Target File Size mode runs multiple encoding passes in milliseconds to guarantee your output stays strictly beneath the required threshold.',
    },
    {
      title: 'Improving Mobile Web Vitals with Compressed Assets',
      content:
        'Images account for over 60% of the total bytes downloaded on average web pages. Compressing your imagery accelerates Largest Contentful Paint (LCP), boosts Google Lighthouse scores, and cuts mobile data usage for your visitors.',
    },
  ],
  relatedPages: [
    { title: 'Compress PDF Online', href: '/compress-pdf' },
    { title: 'Image to PDF Converter', href: '/image-to-pdf' },
    { title: 'Compress to under 50KB', href: '/compress/50kb' },
    { title: 'Compress to under 100KB', href: '/compress/100kb' },
  ],
};

export default function CompressPage() {
  return (
    <ToolPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Tools', href: '/compress' },
        { name: 'Compress Image', href: '/compress' },
      ]}
    />
  );
}
