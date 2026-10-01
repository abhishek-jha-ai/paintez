/**
 * Project imagery: before/after pairs and the gallery.
 *
 * ▸ REPLACE: swap these with real Paint EZ of Clearwater project photos as
 *   they become available. Before/after pairs should be shot from the same
 *   position so the slider lines up.
 */

export type ProjectCategory = "interior" | "exterior" | "cabinets";

export type BeforeAfterProject = {
  id: string;
  label: string;
  title: string;
  description: string;
  category: ProjectCategory;
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  width: number;
  height: number;
  /** CSS object-position used when the frame crops the image. */
  focus?: string;
};

export const beforeAfterProjects: BeforeAfterProject[] = [
  {
    id: "kitchen-cabinets",
    label: "Cabinets",
    title: "Kitchen Cabinet Refresh",
    description: "Dated oak cabinetry updated with a bright, clean painted finish — no replacement needed.",
    category: "cabinets",
    before: { src: "/images/before-after/kitchen-before.jpg", alt: "Kitchen with orange oak cabinets before painting" },
    after: { src: "/images/before-after/kitchen-after.jpg", alt: "Same kitchen with cabinets painted a soft white" },
    width: 1448,
    height: 1086,
    focus: "45% 50%",
  },
  {
    id: "exterior-repaint",
    label: "Exterior",
    title: "Exterior Repaint",
    description: "A weathered, stained stucco exterior brought back with fresh color and crisp white trim.",
    category: "exterior",
    before: { src: "/images/before-after/exterior-before.jpg", alt: "Two-story stucco home with faded, stained paint" },
    after: { src: "/images/before-after/exterior-after.jpg", alt: "Same home freshly painted light blue with white trim" },
    width: 732,
    height: 839,
    focus: "50% 45%",
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  category: ProjectCategory;
  width: number;
  height: number;
};

export const galleryFilters: { label: string; value: "all" | ProjectCategory }[] = [
  { label: "All", value: "all" },
  { label: "Interior", value: "interior" },
  { label: "Exterior", value: "exterior" },
  { label: "Cabinets", value: "cabinets" },
];

export const galleryItems: GalleryItem[] = [
  { src: "/images/before-after/kitchen-after.jpg", alt: "Kitchen with freshly painted white cabinets", caption: "Painted kitchen cabinets", category: "cabinets", width: 1448, height: 1086 },
  { src: "/images/exterior-ladder.jpg", alt: "Painter on a ladder painting the exterior of a two-story home", caption: "Exterior painting", category: "exterior", width: 1600, height: 900 },
  { src: "/images/interior-coastal.jpg", alt: "Painters rolling fresh white paint over blue living room walls", caption: "Living room repaint", category: "interior", width: 1600, height: 900 },
  { src: "/images/cabinets-two-tone.jpg", alt: "Painter finishing white upper cabinets above navy lowers", caption: "Two-tone cabinet painting", category: "cabinets", width: 1600, height: 900 },
  { src: "/images/before-after/exterior-after.jpg", alt: "Two-story home with a fresh light blue exterior and white trim", caption: "Exterior color refresh", category: "exterior", width: 732, height: 839 },
  { src: "/images/interior-bedroom.jpg", alt: "Painter rolling a fresh coat on a bright bedroom wall", caption: "Bedroom walls", category: "interior", width: 1448, height: 1086 },
  { src: "/images/cabinets-spraying.jpg", alt: "Painter spray-finishing kitchen cabinets white", caption: "Cabinet spray finish", category: "cabinets", width: 1536, height: 1024 },
  { src: "/images/interior-family-room.jpg", alt: "Painter covering a blue accent wall with fresh light paint", caption: "Family room update", category: "interior", width: 1600, height: 900 },
  { src: "/images/team-exterior.jpg", alt: "Paint EZ crew painting a home's exterior trim and siding", caption: "Exterior trim & siding", category: "exterior", width: 1600, height: 901 },
];
