"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { METRICS } from "@/data/content";
import { sound } from "@/lib/sound";
import { Section, Kicker } from "./ui";

export default function SectionMetrics() {
  return (
    <Section id="metrics">
      <Kicker index="05" title="TELEMETRY" sub="Live readout of the operator's footprint. Counters spin up as the sensor comes into range." />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {METRICS.map((m) => (
          <Counter key={m.label} {...m} />
        ))}
      </div>
    </Section>
  );
}

function Counter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      let lastTick = 0;
      gsap.to(obj, {
        v: value,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          setN(Math.round(obj.v));
          // soft ticks while the number climbs (throttled)
          const now = performance.now();
          if (sound.enabled && now - lastTick > 85) {
            sound.count();
            lastTick = now;
          }
        },
        onComplete: () => sound.confirm(),
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [value]);

  return (
    <div
      ref={ref}
      data-cursor
      className="bracket glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:glass-strong sm:p-8"
    >
      <span className="b-bl" />
      <span className="b-br" />
      <div
        className="pointer-events-none absolute -inset-8 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 100%, rgba(255,46,46,0.25), transparent 70%)",
        }}
      />
      <div className="relative flex items-baseline">
        <span className="headline tnum text-6xl text-white text-glow sm:text-7xl">
          {n}
        </span>
        <span className="headline text-3xl text-neon sm:text-4xl">{suffix}</span>
      </div>
      <div className="mono relative mt-4 text-[10px] text-white/50 sm:text-xs">
        {label}
      </div>
      {/* baseline meter */}
      <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-1000"
          style={{
            width: `${Math.min(100, (n / value) * 100)}%`,
            background: "linear-gradient(90deg,#8B0000,#FF2E2E)",
          }}
        />
      </div>
    </div>
  );
}
