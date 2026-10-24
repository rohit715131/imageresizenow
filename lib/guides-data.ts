export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  faqs: { question: string; answer: string }[];
  sections: {
    heading: string;
    body: string;
  }[];
}

export const GUIDES: Record<string, GuideArticle> = {
  'how-to-reduce-image-size-without-losing-quality': {
    slug: 'how-to-reduce-image-size-without-losing-quality',
    title: 'How to Reduce Image Size Without Losing Quality (Complete 2026 Guide)',
    description: 'Learn the proven methods to shrink image file sizes by up to 80% while keeping sharp details and vibrant colors for web and print.',
    date: 'October 17, 2026',
    readTime: '6 min read',
    category: 'Optimization Guide',
    author: 'Image Toolkit Engineering',
    sections: [
      {
        heading: 'Understanding Lossy vs. Lossless Compression',
        body: 'Digital images are composed of millions of color points. In uncompressed form, every individual pixel requires 3 to 4 bytes of data. Lossless compression (used in PNG) removes redundant data patterns without altering a single pixel value. Lossy compression (used in JPEG, WebP, and AVIF) intelligently discards subtle color frequencies that the human visual cortex cannot discern. Understanding this difference is key to shrinking images without noticeable quality degradation.'
      },
      {
        heading: 'Step 1: Choose the Right Modern Image Format',
        body: 'Before adjusting compression sliders, ensure you are utilizing the appropriate modern codec. Standardizing on WebP or AVIF rather than legacy PNG or JPG immediately delivers a 30% to 50% smaller footprint at identical visual quality. WebP is ideal for everyday graphics, photos, and transparent logos, while AVIF provides class-leading compression for photographic hero banners.'
      },
      {
        heading: 'Step 2: Scale Down Unnecessary Canvas Dimensions',
        body: 'A photo shot on a 48MP smartphone camera measures approximately 8000x6000 pixels. Placing that raw file on a web page designed to display at a maximum width of 1200 pixels wastes bandwidth. Resizing dimensions down to the actual display size before applying compression provides the greatest file size savings without any perceptible quality drop.'
      },
      {
        heading: 'Step 3: Find the Quality Sweet Spot (80% to 85%)',
        body: 'In JPEG and WebP encoders, image quality follows a logarithmic curve. Quality levels between 95% and 100% yield enormous file sizes with virtually zero perceptible improvement over 85%. Setting quality to 82%–85% typically reduces file size by 65% while keeping images visually indistinguishable from the source.'
      },
      {
        heading: 'Step 4: Target Specific File Sizes for Portals',
        body: 'When submitting images to job portals or government exam forms with hard file caps (like 20KB or 50KB), manual trial-and-error is frustrating. Using our Smart Target File Size mode runs an automated binary search in your browser, hitting the target size ceiling with precision.'
      }
    ],
    faqs: [
      {
        question: 'Can you compress an image without losing any quality?',
        answer: 'Yes, through lossless compression tools and format modernization (such as PNG to lossless WebP). For photographic images, subtle lossy compression (80%-85%) reduces file size by up to 75% with zero human-perceptible difference.'
      },
      {
        question: 'Why are smartphone camera photos so large?',
        answer: 'Modern smartphone sensors capture high dynamic range (HDR) color depth and resolutions upward of 48 megapixels, creating raw files ranging from 4MB to 20MB. Resizing to web dimensions brings these down to under 200KB.'
      }
    ]
  },
  'webp-vs-jpg-vs-avif-comparison': {
    slug: 'webp-vs-jpg-vs-avif-comparison',
    title: 'WebP vs JPG vs AVIF: Which Image Format Should You Use in 2026?',
    description: 'A comprehensive technical comparison between JPEG, WebP, and AVIF. Benchmark compression efficiency, browser compatibility, and best use cases.',
    date: 'October 17, 2026',
    readTime: '7 min read',
    category: 'Format Comparison',
    author: 'Image Toolkit Engineering',
    sections: [
      {
        heading: 'The Evolution of Web Image Formats',
        body: 'JPEG has powered the web since 1992. Over three decades later, web bandwidth demands and mobile user experiences require far greater compression efficiency. Google introduced WebP in 2010 based on VP8 video keyframes, and in 2019 the Alliance for Open Media released AVIF based on the AV1 video codec. Today, all three formats co-exist across the web.'
      },
      {
        heading: 'JPEG: Universal Compatibility at the Cost of Efficiency',
        body: 'JPEG remains the single most compatible format on Earth. Every device, operating system, and printer handles JPEG without friction. However, JPEG lacks support for alpha transparency and exhibits blocky compression artifacts at lower bitrates. For modern web applications, serving pure JPEG is no longer best practice.'
      },
      {
        heading: 'WebP: The Modern Workhorse of the Web',
        body: 'With global browser support exceeding 97%, WebP is the recommended universal standard for web imagery. It supports both lossy and lossless compression, 8-bit alpha transparency, and animated graphics. WebP files are on average 25% to 34% smaller than comparable JPEG files while rendering faster in mobile browsers.'
      },
      {
        heading: 'AVIF: Next-Generation Compression Power',
        body: 'AVIF represents the current pinnacle of image compression technology. Built on the open-source AV1 video standard, AVIF achieves up to 50% smaller file sizes than JPEG and 20% smaller than WebP. It supports 10-bit and 12-bit wide color gamuts (HDR). Browser support now includes Chrome, Safari 16+, Firefox, and Edge.'
      },
      {
        heading: 'Summary Comparison Matrix',
        body: 'Choose JPEG when compatibility with legacy desktop software or print kiosks is strictly necessary. Choose WebP for the majority of production website assets, logos, and e-commerce catalogs. Choose AVIF for maximum bandwidth optimization on high-traffic hero imagery.'
      }
    ],
    faqs: [
      {
        question: 'Is WebP better than JPEG for SEO?',
        answer: 'Yes! Google Lighthouse directly evaluates whether a site serves images in next-gen formats (WebP and AVIF). Serving WebP improves Core Web Vitals and Largest Contentful Paint (LCP).'
      },
      {
        question: 'Does AVIF support transparency like PNG?',
        answer: 'Yes, AVIF fully supports alpha channel transparency in addition to high-efficiency lossy and lossless modes.'
      }
    ]
  },
  'best-image-sizes-for-social-media': {
    slug: 'best-image-sizes-for-social-media',
    title: 'Perfect Social Media Image Sizes (2026 Cheat Sheet & Guide)',
    description: 'The perfect image size for Facebook, Twitter/X, Instagram, YouTube, and LinkedIn posts. Exact 2026 dimensions, aspect ratios, and file size limits.',
    date: 'October 17, 2026',
    readTime: '5 min read',
    category: 'Social Media Specs',
    author: 'Image Toolkit Engineering',
    sections: [
      {
        heading: 'Why Social Platforms Crop and Blur Uploads',
        body: 'Social networks process millions of media uploads each hour. When you upload a picture that deviates from their recommended dimensions or exceeds file weight limits, their servers execute automatic cropping algorithms and aggressive re-compression. Sizing your graphics correctly prior to upload prevents this penalty.'
      },
      {
        heading: 'Perfect Image Size for Facebook and Twitter/X Posts',
        body: 'The perfect image size for Facebook feed posts and shared link cards is 1200 x 630 pixels (1.91:1 aspect ratio). For Twitter/X in-stream posts, the optimal dimensions are 1200 x 675 pixels (or 1600 x 900 pixels in 16:9 widescreen). Using these dimensions ensures your visuals display edge-to-edge without awkward letterboxing or pixelation:\n• Facebook Feed Post / Shared Link: 1200 × 630 px (1.91:1)\n• Facebook Cover Photo: 820 × 312 px (2.63:1)\n• Twitter/X In-Stream Graphic: 1200 × 675 px (16:9)\n• Twitter/X Header Banner: 1500 × 500 px (3:1)'
      },
      {
        heading: 'Instagram Recommended Dimensions',
        body: '• Square Post: 1080 x 1080 px (1:1 aspect ratio)\n• Portrait Post: 1080 x 1350 px (4:5 aspect ratio - occupies the most mobile feed screen space!)\n• Landscape Post: 1080 x 566 px (1.91:1 aspect ratio)\n• Stories & Reels: 1080 x 1920 px (9:16 vertical full screen)\n• Profile Picture: 320 x 320 px'
      },
      {
        heading: 'YouTube Creator Dimensions',
        body: '• Video Thumbnail: 1280 x 720 px (16:9 aspect ratio, minimum 640px width, max 2MB file size)\n• Channel Banner: 2560 x 1440 px (Safe area for mobile and text: 1546 x 423 px)\n• Profile Icon: 800 x 800 px'
      }
    ],
    faqs: [
      {
        question: 'What is the perfect image size for Facebook and Twitter posts?',
        answer: 'For Facebook feed posts and link previews, the perfect size is 1200 x 630 pixels (1.91:1 ratio). For Twitter/X in-stream posts, use 1200 x 675 pixels (16:9 ratio). Both sizes prevent automated cropping and maintain high clarity on mobile and desktop.'
      },
      {
        question: 'Which Instagram post size gets the most engagement?',
        answer: '1080 x 1350 pixels (4:5 portrait) generally achieves higher engagement because it fills more vertical screen real estate as users scroll down mobile feeds.'
      },
      {
        question: 'What size is a 1920x1080 image?',
        answer: 'A 1920x1080 image is Full High Definition (1080p Full HD) with a standard 16:9 widescreen aspect ratio. It contains 2,073,600 total pixels and is the universal standard for YouTube video stills, desktop wallpapers, and presentation slides.'
      }
    ]
  },
  'how-to-convert-images-to-pdf': {
    slug: 'how-to-convert-images-to-pdf',
    title: 'How to Convert JPG, PNG & Photos to PDF Online Privately (2026 Guide)',
    description: 'Complete guide to turning images into clean, printable PDF documents. Learn page sizing (A4 vs Letter), border margins, and why in-browser processing is safer for personal documents.',
    date: 'October 21, 2026',
    readTime: '6 min read',
    category: 'PDF Guide',
    author: 'Image Toolkit Engineering',
    sections: [
      {
        heading: 'Why Convert Images to PDF Instead of Sharing Loose JPEGs?',
        body: 'Digital photographs, receipts, identity documents, and scanned contracts are universally shared as PDF files rather than raw JPEG or PNG pictures. PDFs preserve page layout, lock dimensions across devices and operating systems, prevent unintended re-compression by messaging apps, and allow easy multi-page printing with standardized border margins.'
      },
      {
        heading: 'Selecting the Right Standard Page Geometry: A4 vs. US Letter',
        body: 'When generating a PDF from a digital photo, page geometry dictates how the document looks on paper and screen:\n• A4 (210 × 297 mm): The administrative standard used across Europe, Asia, Australia, and international organizations. Choose A4 for visa paperwork, academic submissions, and European business correspondence.\n• US Letter (8.5 × 11 inches): The official standard in the United States and Canada. Essential for IRS forms, US court filings, and domestic corporate documents.\n• Fit to Image: Matches the PDF page dimensions directly to your image aspect ratio with zero white borders. Perfect for digital art, posters, and certificates intended primarily for on-screen viewing.'
      },
      {
        heading: 'Balancing Print Resolution with Document File Size',
        body: 'Standard web images display at 72 or 96 DPI, while high-quality physical printing requires 300 DPI. When converting camera photos to PDF, our client-side engine embeds high-resolution raster streams without downsampling pixel data, ensuring fine print and watermarks remain completely legible.'
      },
      {
        heading: 'True Privacy: Why In-Browser PDF Assembly Matters for ID Documents',
        body: 'Converting driver\'s licenses, passport scans, tax returns, or banking receipts on traditional cloud conversion websites exposes your biometric and financial data to unknown third-party servers. Using client-side WebAssembly with pdf-lib ensures your files never travel across the internet—the PDF is compiled entirely inside your computer or phone\'s local memory.'
      }
    ],
    faqs: [
      {
        question: 'Can I convert multiple formats like JPG, PNG, and WebP to PDF?',
        answer: 'Yes! Our in-browser converter natively processes JPEG, PNG, and WebP pictures into standardized PDF documents.'
      },
      {
        question: 'Are my personal documents uploaded to a remote server?',
        answer: 'Never. All PDF construction runs 100% locally on your device using pdf-lib. No server logs, caches, or retains your files.'
      },
      {
        question: 'How do I convert a photo to PDF on my iPhone or Android?',
        answer: 'Simply open ImageResizeNow in Safari or Chrome, tap "Image to PDF", choose the photo from your camera roll, and tap "Convert to PDF" to save it directly to your device.'
      }
    ]
  },
  'how-to-compress-pdf-documents': {
    slug: 'how-to-compress-pdf-documents',
    title: 'How to Compress PDF Files Without Losing Text Quality (2026 Guide)',
    description: 'Learn proven techniques to shrink heavy PDF documents down to 100 KB, 200 KB, or 500 KB for job portals and email attachments while preserving sharp, readable text.',
    date: 'October 21, 2026',
    readTime: '6 min read',
    category: 'PDF Guide',
    author: 'Image Toolkit Engineering',
    sections: [
      {
        heading: 'Why PDF Files Become Excessively Large',
        body: 'PDF files frequently balloon in size to 10MB, 20MB, or more due to embedded uncompressed high-resolution images, full-color scanner passes at 600 DPI, redundant font subsets, and vector artwork overhead. When uploading to university portals, government job applications, or court electronic filing systems, strict file limits (such as 100 KB, 200 KB, or 1 MB) can block your submission.'
      },
      {
        heading: 'Understanding PDF Compression Techniques',
        body: 'There are two primary approaches to reducing PDF size:\n• Native Stream Deflation: Strips metadata, compresses font tables, and recompresses embedded raster graphics without altering page structure.\n• Canvas Rasterization & Re-encoding: Renders each page to a high-DPI canvas buffer, re-encodes the visual output using optimized JPEG quantization, and rebuilds a lean single/multi-page PDF. This technique achieves dramatic 70% to 90% size reductions and flattens complex form fields into unified pages.'
      },
      {
        heading: 'Hitting Exact Thresholds: 100 KB, 200 KB, and 500 KB',
        body: 'Different submission gateways enforce specific weight caps:\n• Under 100 KB: Frequently mandated for digital signature sheets, certificates, and government candidate resumes.\n• Under 200 KB: The sweet spot for admission forms and scholarship applications.\n• Under 500 KB / 1 MB: Ideal for multi-page contracts, portfolios, and email attachments.\nOur client-side tool allows you to select these exact kilobyte targets or choose Low, Medium, or High compression presets.'
      },
      {
        heading: 'Preserving Fine Print and Contract Signatures',
        body: 'When compressing documents, fine typography (8pt to 10pt text) and ink signatures must remain sharp. Our rendering pipeline utilizes 150 DPI canvas rasterization with bicubic smoothing so letters stay distinct without muddy compression halos.'
      }
    ],
    faqs: [
      {
        question: 'Will compressing my PDF make the text unreadable?',
        answer: 'With Medium compression or target presets (such as 200 KB), text remains crisp and easily legible on screens and physical prints. If text becomes slightly soft, switch to the Low Compression preset.'
      },
      {
        question: 'Can I compress password-protected PDF files?',
        answer: 'For security reasons, password-protected PDFs must be unlocked by entering your password prior to in-browser compression.'
      },
      {
        question: 'Does PDF compression run privately on my device?',
        answer: 'Yes! All rendering and rebuilding happens using pdfjs-dist and pdf-lib in your local browser sandbox without uploading your files to any remote server.'
      }
    ]
  }
};
