"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { PIPELINE } from "@/data/content";
import { Section, Kicker } from "./ui";

export default function SectionProcess() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const path = line.current!;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 60%",
          end: "bottom 75%",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>(".pipe-node").forEach((node, i) => {
        gsap.from(node, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          filter: "blur(10px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 85%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="process">
      <Kicker index="06" title="THE PIPELINE" sub="How an idea becomes a shipped, optimized system. Each stage feeds the next." />

      <div ref={root} className="relative mx-auto max-w-3xl">
        {/* central spine */}
        <svg
          className="pointer-events-none absolute left-1/2 top-0 h-full w-24 -translate-x-1/2"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
        >
          <path
            ref={line}
            d="M50 0 L50 1000"
            fill="none"
            stroke="url(#pgrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8B0000" />
              <stop offset="0.5" stopColor="#FF2E2E" />
              <stop offset="1" stopColor="#C1121F" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative space-y-6">
          {PIPELINE.map((p, i) => (
            <div
              key={p.step}
              className={`pipe-node relative flex items-center gap-6 ${
                i % 2 === 0 ? "justify-start pr-[52%]" : "flex-row-reverse pl-[52%]"
              }`}
            >
              <div
                className={`bracket glass relative flex-1 rounded-xl p-5 ${
                  i % 2 === 0 ? "text-right" : "text-left"
                }`}
              >
                <span className="b-bl" />
                <span className="b-br" />
                <div className="mono text-[10px] text-neon/70">
                  STAGE {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {p.step}
                </div>
                <div className="mt-1 text-xs text-white/50">{p.note}</div>
              </div>

              {/* center node dot */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-4 w-4 rounded-full bg-neon shadow-[0_0_18px_rgba(255,46,46,0.9)]">
                  <div className="absolute inset-0 animate-ping rounded-full bg-neon/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
