import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PRESET_PAGES } from '@/lib/programmatic-data';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(PRESET_PAGES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = PRESET_PAGES[params.slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.metaDescription,
    alternates: {
      canonical: `https://imageresizenow.com/preset/${data.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url: `https://imageresizenow.com/preset/${data.slug}`,
    },
  };
}

export default function ProgrammaticPresetPage({ params }: PageProps) {
  const data = PRESET_PAGES[params.slug];
  if (!data) {
    notFound();
  }

  return (
    <ToolPageTemplate
      pageData={data}
      breadcrumbs={[
        { name: 'Presets', href: '/' },
        { name: data.h1, href: `/preset/${data.slug}` },
      ]}
    />
  );
}
