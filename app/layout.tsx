import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://imageresizenow.com"),
  alternates: {
    canonical: "https://imageresizenow.com",
  },
  title: {
    default: "Resize, Compress & Convert Images Online | ImageResizeNow",
    template: "%s | ImageResizeNow",
  },
  description:
    "Resize, compress, convert, and crop images in your browser for free. 100% private with client-side processing, no file limits, and zero server uploads.",
  authors: [{ name: "ImageResizeNow Team" }],
  creator: "ImageResizeNow",
  publisher: "ImageResizeNow",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imageresizenow.com",
    siteName: "ImageResizeNow",
    title: "Resize, Compress & Convert Images Online | ImageResizeNow",
    description:
      "Resize, compress, convert, and crop images in your browser for free. 100% private with client-side processing, no file limits, and zero server uploads.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ImageResizeNow Free Online Image Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize, Compress & Convert Images Online | ImageResizeNow",
    description:
      "Resize, compress, convert, and crop images in your browser for free. 100% private with client-side processing, no file limits, and zero server uploads.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9XBFYJ3NZK"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9XBFYJ3NZK');
            `,
          }}
        />
        {/* Anti-flicker script for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-preference');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
