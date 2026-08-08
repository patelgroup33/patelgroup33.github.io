"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

/** Section index tag + title, used to head each section. */
export function Kicker({
  index,
  title,
  sub,
}: {
  index: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-12 md:mb-20">
      <div className="mono mb-4 flex items-center gap-3 text-[10px] text-neon/70 sm:text-xs">
        <span>{index}</span>
        <span className="h-px w-16 bg-gradient-to-r from-neon/60 to-transparent" />
        <span className="text-white/40">SECTOR</span>
      </div>
      <h2 className="headline text-[13vw] text-white sm:text-[9vw] md:text-7xl lg:text-8xl">
        {title.split(" ").map((word, i) => (
          <span key={i} className="reveal-word mr-[0.2em] inline-block">
            {word}
          </span>
        ))}
      </h2>
      {sub && (
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
          {sub}
        </p>
      )}
    </div>
  );
}

/**
 * Assembles children in on scroll — a per-element mask reveal, not a cheap fade.
 * Any descendant with .reveal-word / [data-reveal] gets staggered.
 */
export function Reveal({
  children,
  className,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerGsap();
    const el = ref.current!;
    const targets = el.querySelectorAll<HTMLElement>(
      ".reveal-word, [data-reveal]"
    );
    const items = targets.length ? targets : [el];
    const ctx = gsap.context(() => {
      gsap.from(items, {
        yPercent: (_i, t) => (t.classList.contains("reveal-word") ? 110 : 0),
        y: (_i, t) => (t.classList.contains("reveal-word") ? 0 : y),
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
    }, el);
    return () => ctx.revert();
  }, [y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Standard section shell with vertical rhythm + safe max width. */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 md:py-40 ${className}`}
    >
      {children}
    </section>
  );
}
