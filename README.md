# ImageResizeNow — Free Online Image Toolkit

> **Privacy-First, SEO-First, No Login, One Task at a Time**  
> All image processing (resize, compress, convert, crop) runs **100% client-side** inside the visitor's browser using HTML5 Canvas & WebAssembly. Images never leave the user's device.

---

## 🚀 Features

- **🔒 100% Client-Side Privacy**: Zero server uploads, zero cloud storage, zero tracking cookies.
- **🌓 Dark & Light Mode**: Seamless theme switching with system preference detection and `localStorage` persistence.
- **📱 Fully Mobile-Friendly**: Responsive touch-friendly layout, drag-and-drop dropzone, and mobile navigation drawer.
- **⚡ Lightning Fast Core Web Vitals**: Instant local browser processing with reserved ad space preventing Cumulative Layout Shift (CLS = 0).
- **🔎 SEO-First Programmatic Architecture**:
  - Full static generation (SSG) with complete HTML markup on every route.
  - Dynamic `sitemap.xml` and `robots.txt` generation.
  - Complete JSON-LD structured schemas: `SoftwareApplication`, `HowTo`, `FAQPage`, and `BreadcrumbList`.
  - Canonical tags and Open Graph / Twitter cards on all pages.

---

## 🛠️ Image Processing Tools

1. **Resize Image** (`/resize`):
   - Resize by exact pixels with aspect ratio lock/unlock toggle.
   - Resize by percentage (10% to 200%).
   - Presets: Instagram Square (1080×1080), Instagram Story (1080×1920), YouTube Thumbnail (1280×720), Facebook OG (1200×630), Passport Photo (600×600), Govt Exam Photo (200×230).
2. **Compress Image** (`/compress`):
   - **Target File Size Mode**: Exact kilobyte limits (20 KB, 50 KB, 100 KB, 200 KB, 1 MB, or custom) using iterative binary-search quantization.
   - **Quality Slider Mode**: 10% to 100% fine-tuning.
   - Real-time before & after size comparison and percentage savings indicator.
3. **Convert Formats** (`/convert`):
   - Support for WebP, AVIF, JPG, PNG, and iPhone HEIC.
   - Transparency background replacement for transparent PNG-to-JPG conversion.
4. **Crop Image** (`/crop`):
   - Visual interactive crop overlay with draggable selection.
   - Aspect ratio constraints: Free, 1:1 (Square), 16:9, 4:3, 3:2, 9:16.
   - 90° clockwise/counter-clockwise rotation and horizontal/vertical flips.

---

## 📑 Programmatic Landing Pages Families

- **Resize to Size**: `/resize/1080x1080`, `/resize/1200x630`, `/resize/1280x720`, `/resize/1920x1080`, `/resize/500x500`, `/resize/passport-photo`, `/resize/exam-photo`
- **Compress to Size**: `/compress/20kb`, `/compress/50kb`, `/compress/100kb`, `/compress/200kb`, `/compress/1mb`
- **Convert Formats**: `/convert/png-to-webp`, `/convert/jpg-to-png`, `/convert/png-to-jpg`, `/convert/webp-to-png`, `/convert/heic-to-jpg`, `/convert/jpg-to-avif`
- **Use Cases & Presets**: `/preset/instagram-post`, `/preset/youtube-thumbnail`, `/preset/exam-signature`
- **Guides & Articles**: `/guides`, `/guides/how-to-reduce-image-size-without-losing-quality`, `/guides/webp-vs-jpg-vs-avif-comparison`, `/guides/best-image-sizes-for-social-media`

---

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Tailwind Dark Mode `class`)
- **Icons**: Lucide React
- **Processing**: Browser HTML5 Canvas API + WebAssembly
- **Deployment**: Vercel, Cloudflare Pages, Netlify, or AWS Amplify

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (SSG)
npm run build

# Start production server
npm start
```
