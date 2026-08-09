"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { IDENTITY } from "@/data/content";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const videoWrap = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const topText = useRef<HTMLDivElement>(null);
  const roleWrap = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Morphing job titles
  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % IDENTITY.roles.length),
      1900
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      // --- name: letter by letter reveal on load ---
      const letters = nameRef.current!.querySelectorAll("[data-l]");
      gsap.set(letters, { yPercent: 120, opacity: 0, rotateX: -90 });
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.055,
        duration: 0.9,
        ease: "power4.out",
        delay: 0.45,
      });

      // --- HUD builds in ---
      gsap.from(hud.current!.querySelectorAll("[data-hud]"), {
        opacity: 0,
        scale: 0.82,
        duration: 1.1,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.9,
      });

      // --- scroll-driven camera: zoom in then shrink into next section ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      // A gentle push-in only. The avatar stays solid and simply scrolls away
      // with the section — no shrink, no dim — so the hand-off feels fluid.
      tl.to(videoWrap.current, { scale: 1.16, ease: "none" }, 0)
        .to(hud.current, { scale: 1.08, ease: "none" }, 0)
        // intro text lifts away as the camera pushes in
        .to(topText.current, { opacity: 0, yPercent: -60, ease: "none" }, 0.15)
        .to(roleWrap.current, { opacity: 0, yPercent: 60, ease: "none" }, 0.15);

      // scanning line loop
      gsap.to(scanRef.current, {
        yPercent: 100,
        repeat: -1,
        duration: 3.4,
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[200vh] w-full" aria-label="Hero">
      {/* sticky stage keeps the video fixed while the page scrolls */}
      <div
        ref={stage}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* ---- Vertical stack: name above · face · titles below ---- */}
        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center sm:gap-6">
          {/* top text — kicker + name */}
          <div ref={topText} className="will-animate flex flex-col items-center">
            <div className="mono mb-4 text-[10px] text-neon/70 sm:text-xs" data-hud>
              [ INITIALIZING · OPERATOR PROFILE ]
            </div>
            <h1
              ref={nameRef}
              className="headline w-full whitespace-nowrap text-center leading-none text-white text-glow"
              style={{ perspective: 800, fontSize: "clamp(2.25rem, 10.5vw, 7rem)" }}
            >
              {IDENTITY.name.split("").map((ch, i) => (
                <span
                  key={i}
                  data-l
                  className="inline-block will-animate"
                  style={{
                    transformStyle: "preserve-3d",
                    width: ch === " " ? "0.3em" : undefined,
                  }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </h1>
          </div>

          {/* Video + rings cluster */}
          <div
            ref={videoWrap}
            className="will-animate relative flex items-center justify-center"
            style={{ transformOrigin: "center center" }}
          >
            {/* rotating energy rings behind the face */}
            <div
              ref={hud}
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
              <Rings />
            </div>

            {/* the face video, masked into a disc with red rim */}
            <div
              data-hud
              className="relative z-10 aspect-square w-[52vw] max-w-[300px] overflow-hidden rounded-full sm:w-[40vw] md:w-[27vw]"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(34,211,238,0.5), 0 0 70px -6px rgba(34,211,238,0.45), inset 0 0 60px rgba(12,74,110,0.4)",
              }}
            >
              <video
                className="h-full w-full scale-[1.18] object-cover"
                src="/hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              {/* red duotone + vignette over the face */}
              <div
                className="absolute inset-0 mix-blend-color"
                style={{ background: "rgba(14,165,233,0.35)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, transparent 45%, rgba(5,8,15,0.75) 100%)",
                }}
              />
              {/* scanning line */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  ref={scanRef}
                  className="absolute left-0 top-0 h-16 w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(34,211,238,0.25), transparent)",
                  }}
                />
              </div>
              {/* HUD reticle over face */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-neon/50" />
                <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-neon/50" />
              </div>
            </div>

            {/* floating HUD stat chips */}
            <FloatingChip data-hud className="left-[-14%] top-[10%]" label="FACE_TRACK" value="LOCKED" />
            <FloatingChip data-hud className="right-[-16%] top-[24%]" label="SIGNAL" value="98.3%" />
            <FloatingChip data-hud className="left-[-12%] bottom-[16%]" label="MODEL" value="OS_v2028" />
            <FloatingChip data-hud className="right-[-12%] bottom-[6%]" label="STATUS" value="ONLINE" />
          </div>

          {/* flashing role — glitches between AI Engineer / Software Engineer */}
          <div
            ref={roleWrap}
            data-hud
            className="will-animate relative flex h-9 w-full items-center justify-center sm:h-11"
          >
            <span
              key={roleIndex}
              data-text={IDENTITY.roles[roleIndex]}
              className="role-flash mono text-sm text-silver sm:text-lg"
              style={{ letterSpacing: "0.34em" }}
            >
              {IDENTITY.roles[roleIndex]}
            </span>
          </div>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 text-center sm:block" data-hud>
          <div className="mono text-[10px] text-white/40">SCROLL TO ENTER</div>
          <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-gradient-to-b from-neon to-transparent" />
        </div>
      </div>

      <style jsx>{`
        .role-flash {
          position: relative;
          display: inline-block;
          color: #fff;
          text-shadow: 0 0 14px rgba(34,211,238, 0.55);
          animation: roleFlash 0.5s steps(1, end) both;
        }
        /* red glitch slice that resolves on each swap */
        .role-flash::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          color: #22D3EE;
          pointer-events: none;
          animation: roleSplit 0.5s steps(2, end) 1;
        }
        @keyframes roleFlash {
          0% { opacity: 0; transform: translateX(-8px) skewX(10deg); }
          8% { opacity: 1; transform: translateX(5px) skewX(-8deg); }
          14% { opacity: 0.15; }
          24% { opacity: 1; transform: translateX(-3px) skewX(4deg); }
          34% { opacity: 0.5; }
          46% { opacity: 1; transform: translateX(0) skewX(0deg); }
          58% { opacity: 0.85; }
          70% { opacity: 1; }
          100% { opacity: 1; transform: none; }
        }
        @keyframes roleSplit {
          0% { transform: translate(-5px, 1px); clip-path: inset(0 0 62% 0); opacity: 0.9; }
          25% { transform: translate(5px, -1px); clip-path: inset(55% 0 0 0); opacity: 0.75; }
          50% { transform: translate(-3px, 0); clip-path: inset(24% 0 40% 0); opacity: 0.55; }
          75% { transform: translate(2px, 0); clip-path: inset(70% 0 8% 0); opacity: 0.4; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .role-flash,
          .role-flash::before {
            animation: none;
          }
          .role-flash::before {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function Rings() {
  return (
    <div className="relative h-[80vw] max-h-[620px] w-[80vw] max-w-[620px]">
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full animate-spin-slow">
        <circle cx="300" cy="300" r="290" fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(14,165,233,0.28)" strokeWidth="1" strokeDasharray="60 20 8 20" />
      </svg>
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full animate-spin-reverse">
        <circle cx="300" cy="300" r="215" fill="none" stroke="rgba(34,211,238,0.22)" strokeWidth="1.5" strokeDasharray="2 14" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={r(300 + Math.cos(a) * 205)}
              y1={r(300 + Math.sin(a) * 205)}
              x2={r(300 + Math.cos(a) * 225)}
              y2={r(300 + Math.sin(a) * 225)}
              stroke="rgba(34,211,238,0.5)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full animate-spin-slow" style={{ animationDuration: "40s" }}>
        <circle cx="300" cy="300" r="180" fill="none" stroke="rgba(199,204,209,0.14)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function FloatingChip({
  className,
  label,
  value,
  ...rest
}: {
  className?: string;
  label: string;
  value: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bracket glass absolute z-20 hidden rounded-md px-3 py-2 md:block ${className}`}
      {...rest}
    >
      <span className="b-bl" />
      <span className="b-br" />
      <div className="mono text-[8px] text-white/40">{label}</div>
      <div className="mono text-[11px] text-neon">{value}</div>
    </div>
  );
}
