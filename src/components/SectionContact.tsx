"use client";

import { useState } from "react";
import { IDENTITY } from "@/data/content";
import { sound } from "@/lib/sound";

export default function SectionContact() {
  const [active, setActive] = useState(false);

  const channels = [
    { label: "GITHUB", value: IDENTITY.github, href: IDENTITY.githubUrl, angle: -60 },
    { label: "EMAIL", value: IDENTITY.email, href: `mailto:${IDENTITY.email}`, angle: 0 },
    { label: "RESUME", value: "DOWNLOAD PDF", href: IDENTITY.resume, angle: 60 },
  ];

  return (
    <section
      id="contact"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32"
    >
      <div className="mono mb-4 text-[10px] text-neon/70 sm:text-xs">
        07 / ESTABLISH UPLINK
      </div>
      <h2 className="headline mb-16 text-center text-5xl text-white sm:text-7xl">
        INITIATE
        <br />
        <span className="text-neon text-glow">CONNECTION</span>
      </h2>

      <div className="relative flex h-[340px] w-[340px] items-center justify-center sm:h-[440px] sm:w-[440px]">
        {/* pulsing rings */}
        <div className={`jarvis-pulse absolute inset-0 rounded-full ${active ? "is-active" : ""}`} />

        {/* rotating decorative rings */}
        <svg className="absolute inset-0 h-full w-full animate-spin-slow" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(255,46,46,0.2)" strokeWidth="1" strokeDasharray="3 12" />
        </svg>
        <svg className="absolute inset-0 h-full w-full animate-spin-reverse" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(193,18,31,0.3)" strokeWidth="1.5" strokeDasharray="40 14 6 14" />
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
                stroke="rgba(255,46,46,0.4)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* center button */}
        <button
          data-cursor
          onClick={() => {
            setActive((v) => !v);
            sound.click();
          }}
          onMouseEnter={() => sound.hover()}
          className="jarvis-btn group relative z-20 flex h-40 w-40 flex-col items-center justify-center rounded-full sm:h-48 sm:w-48"
        >
          <span className="jarvis-core absolute inset-0 rounded-full" />
          <span className="relative z-10 flex flex-col items-center">
            <span className="mono text-[10px] tracking-[0.3em] text-white/60">
              {active ? "UPLINK" : "TAP TO"}
            </span>
            <span className="headline mt-1 text-lg text-white text-glow sm:text-xl">
              {active ? "OPEN" : "INITIATE"}
            </span>
            <span className="mono mt-1 text-[9px] text-neon">
              {active ? "● LIVE" : "○ IDLE"}
            </span>
          </span>
        </button>

        {/* channels emerge from the circle */}
        {channels.map((c, i) => (
          <a
            key={c.label}
            href={c.href}
            target={c.label !== "EMAIL" ? "_blank" : undefined}
            rel="noopener noreferrer"
            onMouseEnter={() => sound.hover()}
            className="channel bracket glass-strong glass absolute left-1/2 top-1/2 z-30 hidden min-w-[150px] flex-col rounded-lg px-4 py-3 sm:flex"
            style={{
              transform: active
                ? `translate(-50%,-50%) rotate(${c.angle}deg) translateY(-230px) rotate(${-c.angle}deg)`
                : "translate(-50%,-50%) scale(0.4)",
              opacity: active ? 1 : 0,
              pointerEvents: active ? "auto" : "none",
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
            }}
          >
            <span className="b-bl" />
            <span className="b-br" />
            <span className="mono text-[9px] text-neon/70">{c.label}</span>
            <span className="text-sm text-white">{c.value}</span>
          </a>
        ))}
      </div>

      {/* mobile: channels stack on-screen below the circle instead of radiating off-screen */}
      <div
        className="w-full max-w-sm overflow-hidden sm:hidden"
        style={{
          maxHeight: active ? 340 : 0,
          opacity: active ? 1 : 0,
          pointerEvents: active ? "auto" : "none",
          transition: "max-height 0.5s ease, opacity 0.4s ease",
        }}
      >
        <div className="mt-8 space-y-3">
          {channels.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label !== "EMAIL" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bracket glass-strong glass relative flex items-center justify-between rounded-lg px-5 py-4"
              style={{
                transform: active ? "translateY(0)" : "translateY(14px)",
                opacity: active ? 1 : 0,
                transition: `all 0.45s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s`,
              }}
            >
              <span className="b-bl" />
              <span className="b-br" />
              <span className="flex flex-col">
                <span className="mono text-[9px] text-neon/70">{c.label}</span>
                <span className="text-sm text-white">{c.value}</span>
              </span>
              <span className="text-lg text-neon">→</span>
            </a>
          ))}
        </div>
      </div>

      <p className="mono mt-16 text-center text-[10px] leading-relaxed text-white/40">
        {IDENTITY.location} · BUILT WITH NEXT · GSAP · LENIS
        <br />
        <span className="text-white/25">
          © {new Date().getFullYear()} {IDENTITY.name} — OPERATOR PROFILE v2028
        </span>
      </p>

      <style jsx>{`
        .jarvis-btn {
          background: radial-gradient(circle at 50% 35%, rgba(255, 46, 46, 0.35), rgba(139, 0, 0, 0.15));
          border: 1px solid rgba(255, 46, 46, 0.5);
          box-shadow: 0 0 40px -4px rgba(255, 46, 46, 0.5), inset 0 0 40px rgba(139, 0, 0, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .jarvis-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 0 70px -2px rgba(255, 46, 46, 0.8), inset 0 0 50px rgba(193, 18, 31, 0.6);
        }
        .jarvis-core {
          background: radial-gradient(circle, rgba(255, 46, 46, 0.25), transparent 65%);
          animation: pulseGlow 2.4s ease-in-out infinite;
        }
        .jarvis-pulse {
          border: 1px solid rgba(255, 46, 46, 0.4);
          box-shadow: 0 0 60px rgba(255, 46, 46, 0.2);
          animation: ringPulse 3s ease-out infinite;
        }
        .jarvis-pulse.is-active {
          animation: ringPulse 1.4s ease-out infinite;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.75); opacity: 0.9; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
