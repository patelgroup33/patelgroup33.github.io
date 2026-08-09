"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { IDENTITY } from "@/data/content";
import { sound } from "@/lib/sound";

/**
 * Intro. The avatar video plays once, then disintegrates with a Jarvis-style
 * dissolve and the Uplink (contact links) materialises in the same spot — so the
 * fastest thing a visitor can do is reach the links.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const dissolveScan = useRef<HTMLDivElement>(null);
  const uplink = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const transitioned = useRef(false);

  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState<"video" | "uplink">("video");
  const [linksOpen, setLinksOpen] = useState(false);

  const channels = [
    { label: "GITHUB", value: IDENTITY.github, href: IDENTITY.githubUrl },
    { label: "EMAIL", value: IDENTITY.email, href: `mailto:${IDENTITY.email}` },
    { label: "RESUME", value: "DOWNLOAD PDF", href: IDENTITY.resume },
  ];

  // flashing job title (video phase only — stops once the uplink is up)
  useEffect(() => {
    if (phase !== "video") return;
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % IDENTITY.roles.length),
      1900
    );
    return () => clearInterval(id);
  }, [phase]);

  // name reveal + HUD build-in + scan loop
  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const letters = nameRef.current!.querySelectorAll("[data-l]");
      gsap.set(letters, { yPercent: 120, opacity: 0, rotateX: -90 });
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.055,
        duration: 0.9,
        ease: "power4.out",
        delay: 0.35,
      });
      gsap.from(hud.current!.querySelectorAll("[data-hud]"), {
        opacity: 0,
        scale: 0.82,
        duration: 1.1,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.7,
      });
      gsap.to(scanRef.current, {
        yPercent: 100,
        repeat: -1,
        duration: 3.4,
        ease: "none",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // video: play once, then dissolve → uplink. Robust fallbacks so it always
  // transitions even if autoplay is blocked (mobile) or the clip stalls.
  useEffect(() => {
    const startTransition = () => {
      if (transitioned.current) return;
      transitioned.current = true;
      // visual dissolve (GSAP). If rAF is throttled (e.g. backgrounded tab) this
      // may be skipped, so the phase change below does NOT depend on it.
      const tl = gsap.timeline();
      tl.set(dissolveScan.current, { opacity: 1, top: "-20%" })
        .to(avatar.current, { filter: "brightness(2.4)", duration: 0.1 }, 0)
        .to(dissolveScan.current, { top: "115%", duration: 0.45, ease: "power1.in" }, 0)
        .to(
          avatar.current,
          {
            scale: 1.35,
            opacity: 0,
            filter: "brightness(0.3) blur(18px)",
            duration: 0.7,
            ease: "power2.in",
          },
          0.12
        )
        .to(dissolveScan.current, { opacity: 0, duration: 0.2 }, 0.5);
      // swap to the uplink once the dissolve has mostly played
      window.setTimeout(() => setPhase("uplink"), 780);
    };

    const v = videoEl.current;
    let fallback = window.setTimeout(startTransition, 9000);

    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.play().catch(() => {});

      const onEnded = () => startTransition();
      const onMeta = () => {
        window.clearTimeout(fallback);
        const ms = Math.max(2600, (v.duration || 6) * 1000 + 500);
        fallback = window.setTimeout(startTransition, ms);
      };
      const onGesture = () => v.play().catch(() => {});

      v.addEventListener("ended", onEnded);
      v.addEventListener("loadedmetadata", onMeta);
      // metadata may already be available (e.g. StrictMode re-mount) — schedule now
      if (v.readyState >= 1 && !Number.isNaN(v.duration) && v.duration) onMeta();
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("touchstart", onGesture, { passive: true });

      return () => {
        window.clearTimeout(fallback);
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("loadedmetadata", onMeta);
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("touchstart", onGesture);
      };
    }
    return () => window.clearTimeout(fallback);
  }, []);

  // uplink materialises (opacity/scale are CSS-driven off `phase` below). Links
  // stay closed — the user taps the core to open them (the full Jarvis moment).
  useEffect(() => {
    if (phase !== "uplink") return;
    sound.sweep();
  }, [phase]);

  const toggleLinks = () =>
    setLinksOpen((v) => {
      const next = !v;
      if (next) sound.powerUp();
      else sound.powerDown();
      return next;
    });

  return (
    <section
      ref={root}
      id="uplink"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-5 overflow-hidden px-6 py-24 text-center sm:gap-7"
      aria-label="Intro & Uplink"
    >
      {/* kicker + name (persistent) */}
      <div className="flex flex-col items-center">
        <div className="mono mb-4 text-[10px] text-neon/70 sm:text-xs" data-hud>
          {phase === "video"
            ? "[ INITIALIZING · OPERATOR PROFILE ]"
            : "[ 07 · ESTABLISH UPLINK ]"}
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
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
      </div>

      {/* ---- central swap area: avatar dissolves, uplink materialises ---- */}
      <div className="relative flex h-[330px] w-[330px] items-center justify-center sm:h-[420px] sm:w-[420px]">
        {/* dissolve scan sweep */}
        <div
          ref={dissolveScan}
          className="pointer-events-none absolute left-0 top-0 z-40 h-24 w-full opacity-0"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(34,211,238,0.55), transparent)",
          }}
        />

        {/* AVATAR CLUSTER */}
        <div
          ref={avatar}
          className="will-animate absolute inset-0 flex items-center justify-center"
          style={{
            transformOrigin: "center center",
            visibility: phase === "uplink" ? "hidden" : "visible",
          }}
        >
          <div className="relative flex items-center justify-center">
            <div
              ref={hud}
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
              <Rings />
            </div>

            {/* the face — floats freely, edges feathered to transparent, no boundary */}
            <div
              data-hud
              className="relative z-10 flex aspect-square w-[76vw] max-w-[340px] items-center justify-center sm:w-[360px]"
            >
              {/* soft luminous halo behind the face (no hard edge) */}
              <div
                className="pointer-events-none absolute -inset-6 -z-10 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 46%, rgba(34,211,238,0.22), transparent 60%)",
                }}
              />
              <div
                className="relative h-full w-full"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 44%, #000 48%, rgba(0,0,0,0.6) 68%, transparent 88%)",
                  maskImage:
                    "radial-gradient(circle at 50% 44%, #000 48%, rgba(0,0,0,0.6) 68%, transparent 88%)",
                }}
              >
                <video
                  ref={videoEl}
                  className="pointer-events-none h-full w-full object-cover"
                  src="/hero.mp4"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    v.muted = true;
                    v.play().catch(() => {});
                  }}
                />
                <div
                  className="absolute inset-0 mix-blend-color"
                  style={{ background: "rgba(14,165,233,0.32)" }}
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    ref={scanRef}
                    className="absolute left-0 top-0 h-16 w-full"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, rgba(34,211,238,0.22), transparent)",
                    }}
                  />
                </div>
              </div>
            </div>

            <FloatingChip data-hud className="left-[-14%] top-[10%]" label="FACE_TRACK" value="LOCKED" />
            <FloatingChip data-hud className="right-[-16%] top-[24%]" label="SIGNAL" value="98.3%" />
            <FloatingChip data-hud className="left-[-12%] bottom-[16%]" label="MODEL" value="OS_v2028" />
            <FloatingChip data-hud className="right-[-12%] bottom-[6%]" label="STATUS" value="ONLINE" />
          </div>
        </div>

        {/* UPLINK CLUSTER */}
        <div
          ref={uplink}
          className={`absolute inset-0 flex items-center justify-center ${
            phase === "uplink" ? "up-in" : ""
          }`}
          style={{
            opacity: phase === "uplink" ? 1 : 0,
            pointerEvents: phase === "uplink" ? "auto" : "none",
          }}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <div className={`jarvis-pulse absolute inset-0 rounded-full ${linksOpen ? "is-active" : ""}`} />
            <svg className="absolute inset-0 h-full w-full animate-spin-slow" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1" strokeDasharray="3 12" />
            </svg>
            <svg className="absolute inset-0 h-full w-full animate-spin-reverse" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="1.5" strokeDasharray="40 14 6 14" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * Math.PI * 2;
                const r = (n: number) => Math.round(n * 100) / 100;
                return (
                  <line
                    key={i}
                    x1={r(200 + Math.cos(a) * 150)}
                    y1={r(200 + Math.sin(a) * 150)}
                    x2={r(200 + Math.cos(a) * 162)}
                    y2={r(200 + Math.sin(a) * 162)}
                    stroke="rgba(34,211,238,0.4)"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            <button
              data-cursor
              onClick={toggleLinks}
              onMouseEnter={() => sound.hover()}
              className="jarvis-btn group relative z-20 flex h-36 w-36 flex-col items-center justify-center rounded-full sm:h-44 sm:w-44"
            >
              <span className="jarvis-core absolute inset-0 rounded-full" />
              <span className="relative z-10 flex flex-col items-center">
                <span className="mono text-[10px] tracking-[0.3em] text-white/60">
                  {linksOpen ? "UPLINK" : "TAP TO"}
                </span>
                <span className="headline mt-1 text-lg text-white text-glow sm:text-xl">
                  {linksOpen ? "OPEN" : "CONNECT"}
                </span>
                <span className="mono mt-1 text-[9px] text-neon">
                  {linksOpen ? "● LIVE" : "○ IDLE"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---- below-central: flashing title (video) OR links (uplink) ---- */}
      {phase === "video" ? (
        <div className="relative flex h-9 w-full items-center justify-center sm:h-11" data-hud>
          <span
            key={roleIndex}
            data-text={IDENTITY.roles[roleIndex]}
            className="role-flash mono text-sm text-silver sm:text-lg"
            style={{ letterSpacing: "0.34em" }}
          >
            {IDENTITY.roles[roleIndex]}
          </span>
        </div>
      ) : (
        <div
          className={`flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:justify-center ${
            linksOpen ? "links-in" : ""
          }`}
          style={{
            opacity: linksOpen ? 1 : 0,
            pointerEvents: linksOpen ? "auto" : "none",
          }}
        >
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label !== "EMAIL" ? "_blank" : undefined}
              rel="noopener noreferrer"
              onMouseEnter={() => sound.hover()}
              className="bracket glass-strong glass group relative flex flex-1 items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors duration-300 hover:border-neon/60"
            >
              <span className="b-bl" />
              <span className="b-br" />
              <span className="flex flex-col text-left">
                <span className="mono text-[9px] text-neon/70">{c.label}</span>
                <span className="text-sm text-white">{c.value}</span>
              </span>
              <span className="text-lg text-neon transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
      )}

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 text-center sm:block">
        <div className="mono text-[10px] text-white/40">SCROLL TO EXPLORE</div>
        <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-gradient-to-b from-neon to-transparent" />
      </div>

      <style jsx>{`
        .role-flash {
          position: relative;
          display: inline-block;
          color: #fff;
          text-shadow: 0 0 14px rgba(34, 211, 238, 0.55);
          animation: roleFlash 0.5s steps(1, end) both;
        }
        .role-flash::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          color: #22d3ee;
          pointer-events: none;
          animation: roleSplit 0.5s steps(2, end) 1;
        }
        @keyframes roleFlash {
          0% { opacity: 0; transform: translateX(-8px) skewX(10deg); }
          8% { opacity: 1; transform: translateX(5px) skewX(-8deg); }
          14% { opacity: 0.15; }
          24% { opacity: 1; transform: translateX(-3px) skewX(4deg); }
          46% { opacity: 1; transform: translateX(0) skewX(0deg); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes roleSplit {
          0% { transform: translate(-5px, 1px); clip-path: inset(0 0 62% 0); opacity: 0.9; }
          50% { transform: translate(-3px, 0); clip-path: inset(24% 0 40% 0); opacity: 0.55; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        .up-in {
          animation: upScale 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes upScale {
          from { transform: scale(0.82); }
          to { transform: scale(1); }
        }
        .links-in {
          animation: linksIn 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes linksIn {
          from { transform: translateY(16px); }
          to { transform: translateY(0); }
        }
        .jarvis-btn {
          background: radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.35), rgba(12, 74, 110, 0.15));
          border: 1px solid rgba(34, 211, 238, 0.5);
          box-shadow: 0 0 40px -4px rgba(34, 211, 238, 0.5), inset 0 0 40px rgba(12, 74, 110, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .jarvis-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 0 70px -2px rgba(34, 211, 238, 0.8), inset 0 0 50px rgba(14, 165, 233, 0.6);
        }
        .jarvis-core {
          background: radial-gradient(circle, rgba(34, 211, 238, 0.25), transparent 65%);
          animation: pulseGlow 2.4s ease-in-out infinite;
        }
        .jarvis-pulse {
          border: 1px solid rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 60px rgba(34, 211, 238, 0.2);
          animation: ringPulse 3s ease-out infinite;
        }
        .jarvis-pulse.is-active {
          animation: ringPulse 1.4s ease-out infinite;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.75); opacity: 0.9; }
          100% { transform: scale(1.15); opacity: 0; }
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
    <div className="relative h-[80vw] max-h-[560px] w-[80vw] max-w-[560px]">
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
