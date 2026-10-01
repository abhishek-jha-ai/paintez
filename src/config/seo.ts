import { siteConfig } from "./site";

/** SEO + social preview copy. Rendered in src/app/layout.tsx. */
export const seo = {
  title: "House Painters in Clearwater, FL | Paint EZ of Clearwater",
  shortTitle: "Paint EZ of Clearwater",
  description:
    "Professional painters in Clearwater, FL. Interior, exterior and cabinet painting for your home — book a free quote with Paint EZ of Clearwater today.",
  ogTitle: "Paint EZ of Clearwater — Professional Painting. Made Easy.",
  ogDescription:
    "Interior, exterior and cabinet painting in Clearwater, FL. See the before & after and get a free quote in minutes.",
  ogImage: {
    path: "/og-paint-ez-clearwater.jpg",
    width: 1200,
    height: 630,
    alt: "Paint EZ of Clearwater — Professional Painting. Made Easy. Interior • Exterior • Cabinets",
  },
  keywords: [
    "painters Clearwater FL",
    "house painting Clearwater",
    "interior painting Clearwater",
    "exterior painting Clearwater",
    "cabinet painting Clearwater",
  ],
  themeColor: "#011230",
  locale: "en_US",
  siteName: siteConfig.businessName,
};
