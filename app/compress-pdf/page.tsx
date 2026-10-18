import { Metadata } from 'next';
import { PdfPageTemplate } from '@/features/pdf-tools/components/PdfPageTemplate';
import { PDF_PAGES } from '@/features/pdf-tools/data';

const pageData = PDF_PAGES['compress-pdf'];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    'compress pdf',
    'pdf compressor',
    'reduce pdf size',
    'compress pdf online free',
    'compress pdf to 100kb',
    'compress pdf to 200kb',
    'shrink pdf',
    'reduce pdf file size without losing quality',
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

export default function CompressPdfPage() {
  return (
    <PdfPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Compress PDF', href: pageData.route },
      ]}
    />
  );
}
