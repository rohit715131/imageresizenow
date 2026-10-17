import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CONVERT_PAGES } from '@/lib/programmatic-data';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(CONVERT_PAGES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = CONVERT_PAGES[params.slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    alternates: {
      canonical: `https://imageresizenow.com/convert/${data.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url: `https://imageresizenow.com/convert/${data.slug}`,
    },
  };
}

export default function ProgrammaticConvertPage({ params }: PageProps) {
  const data = CONVERT_PAGES[params.slug];
  if (!data) {
    notFound();
  }

  return (
    <ToolPageTemplate
      pageData={data}
      breadcrumbs={[
        { name: 'Convert', href: '/convert' },
        { name: data.h1, href: `/convert/${data.slug}` },
      ]}
    />
  );
}
