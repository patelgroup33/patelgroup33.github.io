"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { EXPERIENCE } from "@/data/content";

/**
 * Desktop (md+): a horizontal conveyor — the section pins and the track
 * translates on scroll; each card rotates in 3D as it crosses screen-centre.
 * Mobile (<md): the conveyor and its 3D transforms don't work on touch and
 * overlap the heading, so we render a plain vertical stack instead.
 */
export default function SectionExperience() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    // ---- Desktop: pinned horizontal conveyor ----
    mm.add("(min-width: 768px)", () => {
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
    });

    // ---- Mobile: reveal the stacked cards ----
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".exp-card-m").forEach((c) => {
          gsap.from(c, {
            opacity: 0,
            y: 46,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: c, start: "top 88%" },
          });
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="experience" className="relative z-10">
      {/* ============ DESKTOP: horizontal conveyor ============ */}
      <div className="relative hidden h-screen overflow-hidden md:block">
        {/* heading pinned top-left */}
        <div className="pointer-events-none absolute left-10 top-16 z-20">
          <div className="mono mb-3 text-xs text-neon/70">04 / DEPLOYMENT HISTORY</div>
          <h2 className="headline text-7xl text-white">EXPERIENCE</h2>
          <div className="mono mt-3 text-[10px] text-white/40">
            ◂ CONVEYOR · SCROLL TO ADVANCE ▸
          </div>
        </div>

        <div className="flex h-full items-center">
          <div
            ref={track}
            className="flex items-center gap-8 pl-[8vw] pr-[30vw] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {EXPERIENCE.map((job, i) => (
              <article
                key={job.company}
                className="exp-card relative w-[560px] flex-shrink-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="exp-glow pointer-events-none absolute -inset-8 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 40%, rgba(34,211,238,0.22), transparent 70%)",
                  }}
                />
                <ExpCardBody job={job} index={i} />
              </article>
            ))}

            {/* end cap */}
            <div className="exp-card flex w-[420px] flex-shrink-0 items-center justify-center">
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

      {/* ============ MOBILE: vertical stack ============ */}
      <div className="mx-auto w-full max-w-xl px-6 py-24 md:hidden">
        <div className="mono mb-3 text-[10px] text-neon/70">04 / DEPLOYMENT HISTORY</div>
        <h2 className="headline text-5xl text-white">EXPERIENCE</h2>
        <div className="mono mt-3 text-[10px] text-white/40">DEPLOYMENT LOG ↓</div>

        <div className="mt-10 space-y-6">
          {EXPERIENCE.map((job, i) => (
            <article key={job.company} className="exp-card-m relative">
              <ExpCardBody job={job} index={i} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpCardBody({
  job,
  index,
}: {
  job: (typeof EXPERIENCE)[number];
  index: number;
}) {
  return (
    <div className="bracket glass-strong glass relative rounded-2xl p-6 sm:p-8 md:p-10">
      <span className="b-bl" />
      <span className="b-br" />
      <div className="flex items-center justify-between">
        <span className="mono rounded-full border border-neon/30 bg-neon/5 px-3 py-1 text-[10px] text-neon">
          {job.tag}
        </span>
        <span className="mono text-[10px] text-white/40">
          0{index + 1} / 0{EXPERIENCE.length}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-bold text-white sm:mt-6 sm:text-4xl">
        {job.company}
      </h3>
      <p className="mt-2 text-base text-neon sm:text-lg">{job.role}</p>
      <p className="mono mt-1 text-[11px] text-white/40">
        {job.location} · {job.period}
      </p>

      <div className="my-5 h-px w-full bg-gradient-to-r from-neon/40 to-transparent sm:my-6" />

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
  );
}
