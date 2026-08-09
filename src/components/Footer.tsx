"use client";

import { IDENTITY } from "@/data/content";
import { sound } from "@/lib/sound";

export default function Footer() {
  const toUplink = () => {
    sound.click();
    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }
    ).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-neon/10 px-6 py-14 text-center">
      <button
        data-cursor
        onClick={toUplink}
        onMouseEnter={() => sound.hover()}
        className="mono group inline-flex items-center gap-2 rounded-full border border-neon/30 bg-black/40 px-5 py-2 text-[10px] text-white/70 transition-colors hover:border-neon hover:text-neon"
      >
        <span className="transition-transform group-hover:-translate-y-0.5">▲</span>
        RETURN TO UPLINK
      </button>

      <p className="mono mt-10 text-[10px] leading-relaxed text-white/40">
        {IDENTITY.location} · BUILT WITH NEXT · GSAP · LENIS
        <br />
        <span className="text-white/25">
          © {new Date().getFullYear()} {IDENTITY.name} — OPERATOR PROFILE v2028
        </span>
      </p>
    </footer>
  );
}
