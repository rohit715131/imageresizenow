import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { COMPRESS_PAGES } from '@/lib/programmatic-data';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(COMPRESS_PAGES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = COMPRESS_PAGES[params.slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    alternates: {
      canonical: `https://imageresizenow.com/compress/${data.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url: `https://imageresizenow.com/compress/${data.slug}`,
    },
  };
}

export default function ProgrammaticCompressPage({ params }: PageProps) {
  const data = COMPRESS_PAGES[params.slug];
  if (!data) {
    notFound();
  }

  return (
    <ToolPageTemplate
      pageData={data}
      breadcrumbs={[
        { name: 'Compress', href: '/compress' },
        { name: data.h1, href: `/compress/${data.slug}` },
      ]}
    />
  );
}
