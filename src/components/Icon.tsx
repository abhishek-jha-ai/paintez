import {
  Brush,
  CalendarDays,
  House,
  MapPin,
  MessageCircle,
  PaintRoller,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/config/content";

function CabinetIcon(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <rect x="3.5" y="3" width="17" height="18" rx="1.5" />
      <path d="M12 3v18" />
      <path d="M9.5 10v4M14.5 10v4" />
    </svg>
  );
}

const icons = {
  roller: PaintRoller,
  home: House,
  cabinet: CabinetIcon,
  brush: Brush,
  shield: ShieldCheck,
  users: Users,
  tag: Tag,
  "map-pin": MapPin,
  sparkles: Sparkles,
  message: MessageCircle,
  calendar: CalendarDays,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...props} />;
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
