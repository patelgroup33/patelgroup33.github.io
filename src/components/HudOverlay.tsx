"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

const NAV = [
  { id: "engineer", label: "ENGINEER" },
  { id: "creator", label: "CREATOR" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "metrics", label: "TELEMETRY" },
  { id: "process", label: "PIPELINE" },
  { id: "contact", label: "UPLINK" },
];

export default function HudOverlay() {
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [active, setActive] = useState("engineer");

  useEffect(() => {
    let lastY = window.scrollY;
    let acc = 0;
    let lastTick = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? y / h : 0);

      // subtle scroll ticks — throttled by distance, pitch tracks velocity
      if (sound.enabled) {
        const dy = Math.abs(y - lastY);
        acc += dy;
        const now = performance.now();
        if (acc > 130 && now - lastTick > 45) {
          sound.tick(dy / 60);
          acc = 0;
          lastTick = now;
        }
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive((prev) => {
            // a new section materialising → play the transition cue
            if (prev !== id && sound.enabled) sound.transition();
            return id;
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const go = (id: string) => {
    sound.click();
    const el = document.getElementById(id);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } }).__lenis;
    if (el && lenis) lenis.scrollTo(el, { offset: -40 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  const goTop = () => {
    sound.click();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={goTop}
          className="pointer-events-auto flex items-center gap-2"
          data-cursor
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
          </span>
          <span className="mono text-[10px] text-white/70">DEV_PATEL.OS</span>
        </button>

        <div className="pointer-events-auto flex items-center gap-4">
          <span className="mono hidden text-[10px] text-white/40 sm:inline">
            {String(Math.round(progress * 100)).padStart(3, "0")}%
          </span>
          <button
            data-cursor
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sound.setEnabled(next);
            }}
            className="mono flex items-center gap-2 rounded-full border border-neon/30 bg-black/40 px-3 py-1.5 text-[10px] text-white/70 transition-colors hover:border-neon hover:text-neon"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${soundOn ? "bg-neon" : "bg-white/30"}`} />
            {soundOn ? "SOUND ON" : "MUTED"}
          </button>
        </div>
      </header>

      {/* scroll progress line */}
      <div className="fixed inset-x-0 top-0 z-[80] h-[2px] bg-transparent">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${progress})`,
            background: "linear-gradient(90deg,#0C4A6E,#0EA5E9,#22D3EE)",
            boxShadow: "0 0 12px rgba(34,211,238,0.7)",
          }}
        />
      </div>

      {/* side nav dots (desktop) */}
      <nav className="pointer-events-none fixed right-6 top-1/2 z-[70] hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        {NAV.map((n) => (
          <button
            key={n.id}
            data-cursor
            onClick={() => go(n.id)}
            onMouseEnter={() => soundOn && sound.hover()}
            className="pointer-events-auto group flex items-center justify-end gap-3"
          >
            <span
              className={`mono text-[9px] transition-all duration-300 ${
                active === n.id
                  ? "text-neon opacity-100"
                  : "text-white/40 opacity-0 group-hover:opacity-100"
              }`}
            >
              {n.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                active === n.id
                  ? "scale-125 border-neon bg-neon shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  : "border-white/30 bg-transparent group-hover:border-neon"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
