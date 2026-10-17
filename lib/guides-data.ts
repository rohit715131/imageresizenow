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
    title: 'Ultimate Social Media Image Size Guide (2026 Cheat Sheet)',
    description: 'Exact pixel dimensions and aspect ratios for Instagram, YouTube, Facebook, Twitter/X, and LinkedIn. Keep your social graphics sharp and uncropped.',
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
        heading: 'Instagram Recommended Dimensions',
        body: '• Square Post: 1080 x 1080 px (1:1 aspect ratio)\n• Portrait Post: 1080 x 1350 px (4:5 aspect ratio - occupies the most mobile feed screen space!)\n• Landscape Post: 1080 x 566 px (1.91:1 aspect ratio)\n• Stories & Reels: 1080 x 1920 px (9:16 vertical full screen)\n• Profile Picture: 320 x 320 px'
      },
      {
        heading: 'YouTube Creator Dimensions',
        body: '• Video Thumbnail: 1280 x 720 px (16:9 aspect ratio, minimum 640px width, max 2MB file size)\n• Channel Banner: 2560 x 1440 px (Safe area for mobile and text: 1546 x 423 px)\n• Profile Icon: 800 x 800 px'
      },
      {
        heading: 'Facebook & Twitter/X Dimensions',
        body: '• Facebook Feed Post: 1200 x 630 px (1.91:1)\n• Facebook Cover Photo: 820 x 312 px\n• Twitter/X In-Stream Photo: 1200 x 675 px (16:9)\n• Twitter/X Header Banner: 1500 x 500 px (3:1)'
      }
    ],
    faqs: [
      {
        question: 'Which Instagram post size gets the most engagement?',
        answer: '1080 x 1350 pixels (4:5 portrait) generally achieves higher engagement because it fills more vertical screen real estate as users scroll down mobile feeds.'
      }
    ]
  }
};
