"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { BOOT_MODULES } from "@/data/content";
import { Section } from "./ui";

export default function SectionInit() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number[]>(
    BOOT_MODULES.map(() => 0)
  );
  const [master, setMaster] = useState(0);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const state = { m: 0 };
      const bars = BOOT_MODULES.map(() => ({ v: 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.8,
        },
      });

      tl.to(state, {
        m: 100,
        ease: "none",
        onUpdate: () => setMaster(Math.round(state.m)),
      });

      bars.forEach((b, i) => {
        tl.to(
          b,
          {
            v: 100,
            ease: "none",
            onUpdate: () =>
              setProgress((p) => {
                const n = [...p];
                n[i] = Math.round(b.v);
                return n;
              }),
          },
          i * 0.6
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="system">
      <div ref={root} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* left: master boot readout */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="mono mb-4 text-[10px] text-neon/70 sm:text-xs">
            01 / SYSTEM INITIALIZATION
          </div>
          <h2 className="headline text-5xl text-white sm:text-6xl md:text-7xl">
            SYSTEM
            <br />
            <span className="text-neon text-glow">BOOTING</span>
          </h2>

          <div className="mt-10 max-w-md">
            <div className="mono mb-2 flex justify-between text-[10px] text-white/50">
              <span>CORE LOAD</span>
              <span className="tnum text-neon">{master}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full border border-neon/20 bg-black/50">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${master}%`,
                  background:
                    "linear-gradient(90deg, #8B0000, #C1121F, #FF2E2E)",
                  boxShadow: "0 0 18px rgba(255,46,46,0.6)",
                }}
              />
            </div>
            <div className="mono mt-4 text-[10px] leading-relaxed text-white/40">
              {master < 100 ? (
                <>› allocating operator memory…</>
              ) : (
                <span className="text-neon">› VERIFIED. WELCOME, OPERATOR.</span>
              )}
            </div>
          </div>
        </div>

        {/* right: module bars that fill and reveal content */}
        <div className="space-y-5">
          {BOOT_MODULES.map((m, i) => {
            const done = progress[i] >= 100;
            const active = progress[i] > 0;
            return (
              <div
                key={m.label}
                className={`bracket glass relative rounded-lg p-4 transition-colors duration-500 sm:p-5 ${
                  done ? "glass-strong" : ""
                }`}
                style={{
                  opacity: active ? 1 : 0.4,
                }}
              >
                <span className="b-bl" />
                <span className="b-br" />
                <div className="flex items-center justify-between">
                  <span className="mono text-xs text-white sm:text-sm">
                    {m.label}…
                  </span>
                  <span
                    className={`mono tnum text-xs ${
                      done ? "text-neon" : "text-white/50"
                    }`}
                  >
                    {done ? "OK" : `${progress[i]}%`}
                  </span>
                </div>

                {/* ascii-ish bar */}
                <div className="mt-3 flex gap-[3px]">
                  {Array.from({ length: 28 }).map((_, b) => (
                    <span
                      key={b}
                      className="h-3 flex-1 rounded-[1px] transition-colors duration-150"
                      style={{
                        background:
                          (b / 28) * 100 <= progress[i]
                            ? "linear-gradient(180deg,#FF2E2E,#8B0000)"
                            : "rgba(255,255,255,0.06)",
                        boxShadow:
                          (b / 28) * 100 <= progress[i]
                            ? "0 0 6px rgba(255,46,46,0.5)"
                            : "none",
                      }}
                    />
                  ))}
                </div>

                {/* revealed detail */}
                <div
                  className="overflow-hidden transition-all duration-700 ease-out"
                  style={{
                    maxHeight: done ? 40 : 0,
                    opacity: done ? 1 : 0,
                  }}
                >
                  <div className="mono mt-3 text-[10px] text-silver/70">
                    ▸ {m.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
