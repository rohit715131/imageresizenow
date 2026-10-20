import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

const PRESET_TO_RESIZE_MAP: Record<string, string> = {
  'instagram-post': '/resize/1080x1080',
  'youtube-thumbnail': '/resize/1280x720',
  'exam-signature': '/resize/exam-signature',
};

export function generateStaticParams() {
  return Object.keys(PRESET_TO_RESIZE_MAP).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const targetUrl = PRESET_TO_RESIZE_MAP[params.slug];
  if (!targetUrl) return {};

  return {
    title: 'Redirecting to Resize Tool | ImageResizeNow',
    description: 'This preset has moved to our unified resize directory.',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `https://imageresizenow.com${targetUrl}`,
    },
  };
}

export default function ProgrammaticPresetPage({ params }: PageProps) {
  const targetUrl = PRESET_TO_RESIZE_MAP[params.slug];
  if (!targetUrl) {
    notFound();
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Redirecting to Unified Resize Tool...
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        All presets have been consolidated under our standardized <code>/resize/</code> tool.
      </p>
      <Link
        href={targetUrl}
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Click here if not redirected automatically →
      </Link>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("${targetUrl}");`,
        }}
      />
    </div>
  );
}
