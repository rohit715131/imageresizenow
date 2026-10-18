import { Metadata } from 'next';
import { PdfPageTemplate } from '@/features/pdf-tools/components/PdfPageTemplate';
import { PDF_PAGES } from '@/features/pdf-tools/data';

const pageData = PDF_PAGES['image-to-pdf'];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    'image to pdf',
    'convert image to pdf',
    'jpg to pdf',
    'png to pdf',
    'photo to pdf',
    'image to pdf converter online free',
    'jpg to pdf no upload',
    'image to pdf in browser',
  ],
  alternates: {
    canonical: `https://imageresizenow.com${pageData.route}`,
  },
  openGraph: {
    title: pageData.title,
    description: pageData.metaDescription,
    url: `https://imageresizenow.com${pageData.route}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: pageData.title,
    description: pageData.metaDescription,
  },
};

export default function ImageToPdfPage() {
  return (
    <PdfPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Tools', href: '/image-to-pdf' },
        { name: 'Image to PDF', href: pageData.route },
      ]}
    />
  );
}
