import { Metadata } from 'next';
import { PdfPageTemplate } from '@/features/pdf-tools/components/PdfPageTemplate';
import { PDF_PAGES } from '@/features/pdf-tools/data';

const pageData = PDF_PAGES['photo-to-pdf'];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    'photo to pdf',
    'convert photo to pdf',
    'photo to pdf online',
    'turn photo into pdf',
    'smartphone photo to pdf',
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

export default function PhotoToPdfPage() {
  return (
    <PdfPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Image to PDF', href: '/image-to-pdf' },
        { name: 'Photo to PDF', href: pageData.route },
      ]}
    />
  );
}
