import { BrushUnderline } from "./Hero";

export function SectionHeading({
  id,
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  tone = "dark",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  /** Trailing words of the title rendered in teal with a brush underline. */
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow ? <p className={`eyebrow ${tone === "light" ? "!text-teal-400" : ""}`}>{eyebrow}</p> : null}
      <h2
        id={id}
        className={`mt-3 font-display text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.6rem] ${
          tone === "light" ? "text-white" : "text-navy-950"
        }`}
      >
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="relative inline-block whitespace-nowrap text-teal-600">
              {highlight}
              <BrushUnderline className="absolute -bottom-2 left-0 h-2.5 w-full text-teal-500" />
            </span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className={`mt-5 text-[1.05rem] leading-relaxed ${tone === "light" ? "text-white/75" : "text-muted"}`}>{description}</p>
      ) : null}
    </div>
  );
}
