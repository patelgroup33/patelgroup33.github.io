"use client";

import { useEffect, useRef } from "react";

/**
 * A dual-ring reticle cursor. The outer ring lags with a spring; the inner dot
 * tracks instantly. Grows and locks a red glow over interactive targets.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const d = dot.current!;
    const r = ring.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hovering = false;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        "a, button, [data-cursor], input, textarea, [role='button']"
      );
      if (interactive !== hovering) {
        hovering = interactive;
        r.classList.toggle("cursor-lock", hovering);
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const down = () => r.classList.add("cursor-down");
    const up = () => r.classList.remove("cursor-down");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-neon md:block"
        style={{ boxShadow: "0 0 10px 2px rgba(255,46,46,0.9)" }}
      />
      <div
        ref={ring}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border border-neon/60 md:block"
      />
      <style jsx global>{`
        .cursor-ring {
          transition: width 0.22s ease, height 0.22s ease, background 0.22s ease,
            border-color 0.22s ease;
        }
        .cursor-ring.cursor-lock {
          width: 48px;
          height: 48px;
          border-color: rgba(255, 46, 46, 0.9);
          background: rgba(255, 46, 46, 0.08);
          box-shadow: 0 0 24px rgba(255, 46, 46, 0.4);
        }
        .cursor-ring.cursor-down {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  );
}
