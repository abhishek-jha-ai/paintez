import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { seo } from "@/config/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["500", "600", "700", "800"], display: "swap" });

const ogImageUrl = `${siteConfig.url}${seo.ogImage.path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  applicationName: siteConfig.businessName,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: seo.siteName,
    locale: seo.locale,
    title: seo.ogTitle,
    description: seo.ogDescription,
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: seo.ogImage.width,
        height: seo.ogImage.height,
        alt: seo.ogImage.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.ogTitle,
    description: seo.ogDescription,
    images: [{ url: ogImageUrl, alt: seo.ogImage.alt, width: seo.ogImage.width, height: seo.ogImage.height }],
  },
};

export const viewport: Viewport = {
  themeColor: seo.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
