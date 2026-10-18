import { Metadata } from 'next';
import { PdfPageTemplate } from '@/features/pdf-tools/components/PdfPageTemplate';
import { PDF_PAGES } from '@/features/pdf-tools/data';

const pageData = PDF_PAGES['compress-pdf-to-500kb'];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    'compress pdf to 500kb',
    'reduce pdf file size without losing quality',
    'shrink pdf to 500kb',
    'multi page pdf compressor',
    'email pdf compressor',
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

export default function CompressPdfTo500kbPage() {
  return (
    <PdfPageTemplate
      pageData={pageData}
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Compress PDF', href: '/compress-pdf' },
        { name: 'Compress to 500KB', href: pageData.route },
      ]}
    />
  );
}
