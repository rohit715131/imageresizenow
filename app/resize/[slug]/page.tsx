import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RESIZE_PAGES } from '@/lib/programmatic-data';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(RESIZE_PAGES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = RESIZE_PAGES[params.slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    alternates: {
      canonical: `https://imageresizenow.com/resize/${data.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url: `https://imageresizenow.com/resize/${data.slug}`,
    },
  };
}

export default function ProgrammaticResizePage({ params }: PageProps) {
  const data = RESIZE_PAGES[params.slug];
  if (!data) {
    notFound();
  }

  return (
    <ToolPageTemplate
      pageData={data}
      breadcrumbs={[
        { name: 'Resize', href: '/resize' },
        { name: data.h1, href: `/resize/${data.slug}` },
      ]}
    />
  );
}
