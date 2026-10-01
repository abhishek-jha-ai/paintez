/**
 * Page copy and section data. Keep wording general and accurate — do not add
 * reviews, ratings, warranties, licences, years in business or other claims
 * unless the owner has supplied them.
 */

export type IconName =
  | "roller"
  | "home"
  | "cabinet"
  | "brush"
  | "shield"
  | "users"
  | "tag"
  | "map-pin"
  | "sparkles"
  | "message"
  | "calendar";

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#our-work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Professional painters in",
  title: "Clearwater, FL",
  description:
    "Interior, exterior, cabinet painting and more. Transform your home with a fresh, clean look from a local team you can trust.",
  primaryCta: { label: "Get a Free Quote", href: "#quote" },
  secondaryCta: { label: "See Our Work", href: "#our-work" },
  image: {
    src: "/images/hero-owner.jpg",
    alt: "Paint EZ of Clearwater painter standing in front of a freshly painted Clearwater home",
  },
  badge: { line1: "Proudly serving", line2: "Clearwater, FL" },
};

export const trustPoints: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Quality Workmanship", text: "Careful prep and clean, even finishes" },
  { icon: "home", title: "Residential Experts", text: "Interior, exterior and cabinet painting" },
  { icon: "tag", title: "Free Quotes", text: "Tell us about your project in minutes" },
];

export type ServiceId = "interior" | "exterior" | "cabinets" | "more";

export const services: {
  id: ServiceId;
  title: string;
  description: string;
  icon: IconName;
  image: { src: string; alt: string };
  /** Value pre-selected in the quote wizard's "What do you need painted?" step. */
  quoteValue?: string;
}[] = [
  {
    id: "interior",
    title: "Interior Painting",
    description: "Refresh living spaces with clean, professional finishes.",
    icon: "roller",
    image: { src: "/images/services/interior.jpg", alt: "Bright living room with freshly painted walls" },
    quoteValue: "interior",
  },
  {
    id: "exterior",
    title: "Exterior Painting",
    description: "Improve curb appeal and protect your home's exterior.",
    icon: "home",
    image: { src: "/images/services/exterior.jpg", alt: "Two-story home with a freshly painted exterior" },
    quoteValue: "exterior",
  },
  {
    id: "cabinets",
    title: "Cabinet Painting",
    description: "Update kitchens and bathrooms without replacing cabinetry.",
    icon: "cabinet",
    image: { src: "/images/services/cabinets.jpg", alt: "Kitchen with painted two-tone cabinets" },
    quoteValue: "cabinets",
  },
  {
    id: "more",
    title: "More",
    description: "Trim, doors, garages, accent walls and related residential painting work.",
    icon: "brush",
    image: { src: "/images/services/more.jpg", alt: "Freshly painted front door and white trim" },
  },
];

export const trustFeatures: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "map-pin",
    title: "Local & Trusted",
    text: "A Clearwater painting team serving homeowners right here in the area.",
  },
  {
    icon: "sparkles",
    title: "Quality Results",
    text: "Thoughtful prep, clean lines and attention to the details that make a room feel finished.",
  },
  {
    icon: "message",
    title: "Clear Communication",
    text: "Straightforward quotes and simple updates, so you know what to expect.",
  },
  {
    icon: "calendar",
    title: "Flexible Scheduling",
    text: "We'll work with you to find a project timeline that fits your schedule.",
  },
];

export const about = {
  eyebrow: "About us",
  title: "Local Painting Made Simple",
  body: "Paint EZ of Clearwater helps homeowners refresh and improve their homes through interior, exterior, and cabinet painting services. Our goal is to keep the whole experience easy — from your first quote to the final walkthrough.",
  points: [
    { title: "Simple process", text: "A quick quote, a clear plan, and a scheduled start." },
    { title: "Clear communication", text: "You'll know what's happening and when." },
    { title: "Local service", text: "Based in Clearwater and focused on local homes." },
    { title: "Clean results", text: "Crisp lines and a tidy space when we're done." },
  ],
  image: {
    src: "/images/owner-house.jpg",
    alt: "Paint EZ of Clearwater team member outside a home with the Paint EZ van",
  },
};

export const processSteps = [
  { number: "01", title: "Request a Quote", text: "Answer a few quick questions about your home and project." },
  { number: "02", title: "Project Review", text: "We talk through the surfaces, colors and details you have in mind." },
  { number: "03", title: "Schedule the Work", text: "Choose a start date that works around your schedule." },
  { number: "04", title: "Refresh Your Home", text: "Enjoy clean, fresh results in your newly painted space." },
];
