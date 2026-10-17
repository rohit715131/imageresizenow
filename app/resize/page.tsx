import { Metadata } from 'next';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ProgrammaticPageData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Resize Image Online Free - Change Dimensions Without Quality Loss',
  description:
    'Free online image resizer. Resize images by exact pixels, percentage, or social media presets with aspect ratio lock. 100% private in your browser with zero uploads.',
  alternates: {
    canonical: 'https://imageresizenow.com/resize',
  },
};

const pageData: ProgrammaticPageData = {
  slug: 'resize',
  title: 'Free Online Image Resizer',
  metaDescription:
    'Resize images by pixels, percentage, or social media presets with aspect ratio lock. 100% private in your browser.',
  h1: 'Resize Image Online Free',
  toolType: 'resize',
  badge: 'Image Resizer Tool',
  description:
    'Quickly resize photos and graphics by exact pixel dimensions, percentage scale, or popular social media presets. High-precision bicubic resampling runs privately in your web browser.',
  howToSteps: [
    { name: 'Upload Image', text: 'Select, drag and drop, or paste (Ctrl+V) your image into the tool.' },
    { name: 'Set Dimensions', text: 'Enter custom width/height or choose a percentage scale or preset.' },
    { name: 'Maintain Ratio', text: 'Keep proportions locked with aspect ratio toggle, or unlock to stretch.' },
    { name: 'Download Result', text: 'Click "Resize Image" and download your crisp, watermark-free result.' },
  ],
  faqs: [
    {
      question: 'Will resizing an image reduce its sharpness or quality?',
      answer:
        'Our engine utilizes multi-pass bicubic interpolation. Downscaling retains maximum sharpness and color fidelity, while intelligent filtering minimizes pixelation during upscaling.',
    },
    {
      question: 'How do I keep the aspect ratio when changing width or height?',
      answer:
        'The aspect ratio lock (padlock icon) is enabled by default. Changing the width automatically recalculates the proportional height, and vice versa.',
    },
    {
      question: 'Is my image uploaded to any server during resize?',
      answer:
        'No! The resizing logic runs entirely in your local browser sandbox via HTML5 Canvas. Your files never touch a remote server.',
    },
    {
      question: 'What image formats can I resize?',
      answer:
        'You can resize JPG, PNG, WebP, AVIF, HEIC, GIF, and BMP images, and export to JPG, PNG, WebP, or AVIF.',
    },
  ],
  contentSections: [
    {
      title: 'Precision Pixel Control for Web and Print',
      content:
        'Whether preparing product imagery for an online catalog, formatting banners for social media channels, or prepping high-resolution photography for digital displays, having exact pixel dimensions is paramount. Our tool allows you to specify target dimensions down to the single pixel without needing bulky desktop photo editing suites.',
    },
    {
      title: 'Bicubic Resampling vs. Nearest Neighbor',
      content:
        'Simple resizing tools often produce harsh, jagged edges or blurry text because they use primitive nearest-neighbor algorithms. Our client-side rendering pipeline activates browser hardware acceleration with high-quality smoothing, preserving clean typography, gentle gradients, and facial features.',
    },
  ],
  relatedPages: [
    { title: '1080×1080 Square Preset', href: '/resize/1080x1080' },
    { title: '1200×630 OG Share Preset', href: '/resize/1200x630' },
    { title: 'Passport Photo 600×600', href: '/resize/passport-photo' },
    { title: 'Compress to under 100KB', href: '/compress/100kb' },
  ],
};

export default function ResizePage() {
  return (
    <ToolPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Tools', href: '/resize' },
        { name: 'Resize Image', href: '/resize' },
      ]}
    />
  );
}
