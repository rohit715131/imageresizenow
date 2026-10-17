import { Metadata } from 'next';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ProgrammaticPageData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Crop Image Online Free - Aspect Ratio & Visual Selector',
  description:
    'Free online image cropper. Crop images to free or fixed aspect ratios (1:1, 16:9, 4:3, 9:16). Rotate 90 degrees and flip horizontal/vertical. 100% private in browser.',
  keywords: [
    'image cropper',
    'crop image online',
    'image editor',
    'image processing',
    'square photo cropper',
    'rotate image online',
  ],
  alternates: {
    canonical: 'https://imageresizenow.com/crop',
  },
};

const pageData: ProgrammaticPageData = {
  slug: 'crop',
  title: 'Free Online Image Cropper',
  metaDescription:
    'Crop images to free or fixed aspect ratios (1:1, 16:9, 4:3, 9:16). Rotate 90 degrees and flip horizontal/vertical.',
  h1: 'Crop Image Online Free',
  toolType: 'crop',
  badge: 'Visual Crop & Rotate',
  description:
    'Trim unwanted edges, reframe subjects, and crop images to exact aspect ratios (1:1 square, 16:9 widescreen, 4:3, 9:16 vertical). Includes 90° rotation and horizontal/vertical flip controls.',
  howToSteps: [
    { name: 'Upload Photo', text: 'Select, drag and drop, or paste (Ctrl+V) your image.' },
    { name: 'Select Aspect Ratio', text: 'Choose Free crop or lock to 1:1, 16:9, 4:3, 3:2, or 9:16.' },
    { name: 'Adjust Crop Frame', text: 'Drag the visual crop boundary box over the target area.' },
    { name: 'Crop & Download', text: 'Click "Crop & Save" and download your perfectly cropped picture.' },
  ],
  faqs: [
    {
      question: 'Can I crop to a square 1:1 ratio for Instagram or avatars?',
      answer:
        'Yes! Simply click the "1:1 (Square)" preset button. The crop box locks into a perfect square that you can slide over the exact portion of the image you want.',
    },
    {
      question: 'Can I also rotate upside-down or sideways images?',
      answer:
        'Yes, you can rotate 90° clockwise or counter-clockwise, or flip horizontally and vertically with one click before cropping.',
    },
    {
      question: 'Will cropping reduce the resolution of the cropped area?',
      answer:
        'No, cropping extracts native pixels directly from the original image at full 100% native resolution without unnecessary re-sampling or compression degradation.',
    },
    {
      question: 'Are my pictures uploaded to a remote server to be cropped?',
      answer:
        'No. Everything is rendered right inside your browser window using client-side HTML5 Canvas. Your photos never leave your device.',
    },
  ],
  contentSections: [
    {
      title: 'Framing Your Visuals with Aspect Ratios',
      content:
        'Cropping is the most effective photographic technique to eliminate distracting background clutter and focus the viewer\'s eye directly on your focal subject. Using standard aspect ratios (like 1:1 for social feeds, 16:9 for YouTube thumbnails, or 9:16 for TikTok/Reels) guarantees that your compositions display without automatic clipping.',
    },
    {
      title: 'Rule of Thirds Composition Helper',
      content:
        'Our visual crop overlay renders a 3×3 rule-of-thirds grid over your active selection. Aligning horizons along the horizontal guidelines and focal points at the intersections produces balanced, professional-looking imagery.',
    },
  ],
  relatedPages: [
    { title: '1080×1080 Square Preset', href: '/resize/1080x1080' },
    { title: 'Passport Photo 600×600', href: '/resize/passport-photo' },
    { title: 'YouTube Thumbnail 1280×720', href: '/preset/youtube-thumbnail' },
    { title: 'Compress to under 50KB', href: '/compress/50kb' },
  ],
};

export default function CropPage() {
  return (
    <ToolPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Tools', href: '/crop' },
        { name: 'Crop Image', href: '/crop' },
      ]}
    />
  );
}
