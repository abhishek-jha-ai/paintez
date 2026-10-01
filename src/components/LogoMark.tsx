/** Paint EZ brush-in-circle mark, recreated as SVG from the brand artwork. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {/* ring, open at the bottom for the brush handle */}
      <path
        d="M24.6 59.2A28 28 0 1 1 39.4 59.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      {/* brush head */}
      <rect x="18" y="13" width="28" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="3.6" />
      <text
        x="32"
        y="30.4"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="14.5"
        fill="currentColor"
        letterSpacing="-0.6"
      >
        EZ
      </text>
      {/* ferrule */}
      <rect x="18" y="37.5" width="28" height="4.4" rx="1.4" fill="currentColor" />
      <rect x="20" y="43.6" width="24" height="3.4" rx="1.2" fill="currentColor" />
      {/* handle */}
      <path d="M28.2 47h7.6l-1.5 11.6c-.35 2.6-4.25 2.6-4.6 0z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const word = tone === "dark" ? "text-navy-950" : "text-white";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0 text-teal-500 sm:h-11 sm:w-11" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.75rem] ${word}`}>
          paint<span className="text-teal-500">EZ</span>
        </span>
        <span className={`mt-0.5 font-display text-[0.6rem] font-semibold tracking-[0.28em] sm:text-[0.64rem] ${word}`}>
          OF CLEARWATER
        </span>
      </span>
    </span>
  );
}
