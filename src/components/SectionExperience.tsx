"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { EXPERIENCE } from "@/data/content";

/**
 * A horizontal conveyor: the section pins and the track translates on scroll.
 * Each company card rotates in 3D as it crosses screen-centre.
 */
export default function SectionExperience() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const trackEl = track.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");

      const getScroll = () =>
        trackEl.scrollWidth - window.innerWidth + window.innerWidth * 0.12;

      const tween = gsap.to(trackEl, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getScroll(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // rotate each card based on its distance from viewport centre
      const update = () => {
        const cx = window.innerWidth / 2;
        cards.forEach((c) => {
          const r = c.getBoundingClientRect();
          const cardCx = r.left + r.width / 2;
          const dist = (cardCx - cx) / cx; // -1..1
          const rotY = gsap.utils.clamp(-38, 38, dist * 42);
          const scale = gsap.utils.clamp(0.86, 1.04, 1.04 - Math.abs(dist) * 0.22);
          const z = -Math.abs(dist) * 120;
          c.style.transform = `perspective(1200px) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale})`;
          c.style.opacity = String(gsap.utils.clamp(0.35, 1, 1 - Math.abs(dist) * 0.5));
          const glow = c.querySelector<HTMLElement>(".exp-glow");
          if (glow) glow.style.opacity = String(gsap.utils.clamp(0, 1, 1 - Math.abs(dist) * 1.4));
        });
      };

      tween.eventCallback("onUpdate", update);
      ScrollTrigger.addEventListener("refresh", update);
      update();

      return () => ScrollTrigger.removeEventListener("refresh", update);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="experience" className="relative z-10">
      <div className="relative h-screen overflow-hidden">
        {/* heading pinned top-left */}
        <div className="pointer-events-none absolute left-6 top-16 z-20 sm:left-10">
          <div className="mono mb-3 text-[10px] text-neon/70 sm:text-xs">
            04 / DEPLOYMENT HISTORY
          </div>
          <h2 className="headline text-5xl text-white sm:text-7xl">
            EXPERIENCE
          </h2>
          <div className="mono mt-3 text-[10px] text-white/40">
            ◂ CONVEYOR · SCROLL TO ADVANCE ▸
          </div>
        </div>

        {/* the conveyor track */}
        <div className="flex h-full items-center">
          <div
            ref={track}
            className="flex items-center gap-8 pl-[8vw] pr-[30vw] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {EXPERIENCE.map((job, i) => (
              <article
                key={job.company}
                className="exp-card relative w-[86vw] flex-shrink-0 sm:w-[560px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="exp-glow pointer-events-none absolute -inset-8 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 40%, rgba(255,46,46,0.22), transparent 70%)",
                  }}
                />
                <div className="bracket glass-strong glass relative rounded-2xl p-8 sm:p-10">
                  <span className="b-bl" />
                  <span className="b-br" />
                  <div className="flex items-center justify-between">
                    <span className="mono rounded-full border border-neon/30 bg-neon/5 px-3 py-1 text-[10px] text-neon">
                      {job.tag}
                    </span>
                    <span className="mono text-[10px] text-white/40">
                      0{i + 1} / 0{EXPERIENCE.length}
                    </span>
                  </div>

                  <h3 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                    {job.company}
                  </h3>
                  <p className="mt-2 text-lg text-neon">{job.role}</p>
                  <p className="mono mt-1 text-[11px] text-white/40">
                    {job.location} · {job.period}
                  </p>

                  <div className="my-6 h-px w-full bg-gradient-to-r from-neon/40 to-transparent" />

                  <ul className="space-y-3">
                    {job.points.map((pt, k) => (
                      <li
                        key={k}
                        className="flex gap-3 text-[13px] leading-relaxed text-white/65"
                      >
                        <span className="mono mt-0.5 text-[10px] text-neon">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}

            {/* end cap */}
            <div className="exp-card flex w-[60vw] flex-shrink-0 items-center justify-center sm:w-[420px]">
              <div className="text-center">
                <div className="headline text-6xl text-white/10">/// END</div>
                <div className="mono mt-3 text-[10px] text-neon/60">
                  MORE INCOMING · 2026 →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
