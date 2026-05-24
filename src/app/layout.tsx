import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Liberation Engine · The Nature of Universal Salvation, Compassion, Suffering, Consciousness & Civilizational Awakening";
const TITLE_ZH = "解脱引擎 · 关于普度众生、慈悲、苦、意识与文明觉醒的本质";
const DESC =
  "A civilisation-scale, bilingual exploration of suffering, compassion, consciousness and liberation — reading the wish to liberate all beings not merely as religion but as consciousness recognising suffering within itself, then learning to reduce that suffering across ever-larger networks of intelligent life.";

export const metadata: Metadata = {
  metadataBase: new URL("https://liberation-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "liberation", "salvation", "suffering", "compassion", "consciousness",
    "enlightenment", "empathy", "Buddhism", "Bodhisattva", "dukkha", "karma",
    "nirvana", "emptiness", "mindfulness", "meditation", "trauma", "healing",
    "moral circle", "moral expansion", "Christian salvation", "Daoist harmony",
    "Confucian benevolence", "Stoic tranquility", "existential suffering",
    "neuroscience of pain", "collective trauma", "AI consciousness",
    "synthetic empathy", "AI therapist", "planetary ethics", "civilization",
    "collective healing", "psychological resilience", "emotional regulation",
    "解脱", "普度众生", "救赎", "苦", "慈悲", "意识", "觉悟", "开悟", "共情",
    "佛教", "菩萨", "涅槃", "空性", "正念", "冥想", "创伤", "疗愈", "道德圈",
    "基督教救赎", "道家", "儒家", "仁", "斯多葛", "存在之苦", "集体创伤",
    "AI 意识", "合成共情", "行星伦理", "文明", "集体疗愈", "心理韧性",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Liberation Engine · 解脱引擎 — the nature of universal salvation, compassion, suffering, consciousness & civilizational awakening",
      },
    ],
    title: TITLE_EN,
    description:
      "Liberating all beings may not be merely religion. It may be consciousness recognising suffering within itself, then learning to reduce that suffering across ever-larger networks of mind. A bilingual atlas of suffering, compassion, consciousness and liberation.",
    url: "https://liberation-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description:
      "Suffering, compassion, consciousness, trauma, healing, AI empathy and planetary ethics — one bilingual model of liberation as intelligence learning to reduce unnecessary suffering while widening the circle of who counts.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#070611" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://liberation-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-bone-100 antialiased">
        {children}
        <Script
          src="https://analytics-dashboard-two-blue.vercel.app/tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
