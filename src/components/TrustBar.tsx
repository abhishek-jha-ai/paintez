import { trustPoints } from "@/config/content";
import { Icon } from "./Icon";

export function TrustBar() {
  return (
    <div className="container-page relative z-10 lg:-mt-16">
      <ul
        aria-label="Why homeowners choose Paint EZ"
        className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-white py-4 shadow-card sm:py-5 lg:py-6"
      >
        {trustPoints.map((point) => (
          <li key={point.title} className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:gap-3.5 sm:px-5 sm:text-left lg:px-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 sm:h-12 sm:w-12">
              <Icon name={point.icon} className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.9} />
            </span>
            <span>
              <span className="block font-display text-[0.85rem] font-semibold leading-tight text-navy-950 sm:text-base">{point.title}</span>
              <span className="mt-0.5 hidden text-sm text-muted sm:block">{point.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
