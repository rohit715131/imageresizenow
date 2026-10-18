import { Metadata } from 'next';
import { PdfPageTemplate } from '@/features/pdf-tools/components/PdfPageTemplate';
import { PDF_PAGES } from '@/features/pdf-tools/data';

const pageData = PDF_PAGES['jpg-to-pdf'];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    'jpg to pdf',
    'convert jpg to pdf',
    'jpg to pdf no upload',
    'jpeg to pdf converter online free',
    'image to pdf',
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

export default function JpgToPdfPage() {
  return (
    <PdfPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Image to PDF', href: '/image-to-pdf' },
        { name: 'JPG to PDF', href: pageData.route },
      ]}
    />
  );
}
