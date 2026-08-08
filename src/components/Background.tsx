"use client";

import { useEffect, useRef } from "react";

/**
 * The "operating system" backdrop. One 2D canvas draws a drifting particle
 * field, constellation links and travelling red energy scanlines. Scroll
 * velocity injects motion; the loop pauses when the tab is hidden.
 * A CSS perspective grid + gradient sits behind it.
 */
type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    let running = true;

    const mouse = { x: -999, y: -999 };
    let scrollV = 0;
    let lastScroll = window.scrollY;
    // energy lines
    const lines = Array.from({ length: 3 }, (_, i) => ({
      y: Math.random(),
      speed: 0.00016 + i * 0.00009,
      w: 0.4 + Math.random() * 0.5,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(120, Math.floor((w * h) / 14000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onScroll = () => {
      const y = window.scrollY;
      scrollV = Math.min(Math.abs(y - lastScroll), 60);
      lastScroll = y;
      // parallax the grid
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(0, ${(-y * 0.04).toFixed(
          1
        )}px, 0)`;
      }
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) loop();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      scrollV *= 0.92;

      // --- energy scan lines ---
      for (const ln of lines) {
        ln.y += ln.speed + scrollV * 0.0008;
        if (ln.y > 1.1) ln.y = -0.1;
        const py = ln.y * h;
        const grad = ctx.createLinearGradient(0, py - 40, 0, py + 40);
        grad.addColorStop(0, "rgba(255,46,46,0)");
        grad.addColorStop(0.5, `rgba(255,46,46,${0.10 * ln.w})`);
        grad.addColorStop(1, "rgba(255,46,46,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, py - 40, w, 80);
        ctx.fillStyle = `rgba(255,80,80,${0.18 * ln.w})`;
        ctx.fillRect(0, py, w, 1);
      }

      // --- particles + links ---
      const drift = 1 + scrollV * 0.05;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * drift;
        p.y += p.vy * drift;

        // mouse repulsion
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm2 = dxm * dxm + dym * dym;
        if (dm2 < 14000) {
          const f = (14000 - dm2) / 14000;
          const d = Math.sqrt(dm2) || 1;
          p.x += (dxm / d) * f * 1.4;
          p.y += (dym / d) * f * 1.4;
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${80 + p.r * 30},${80 + p.r * 20},${p.a})`;
        ctx.fill();

        // link to nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 11000) {
            const o = (1 - d2 / 11000) * 0.22;
            ctx.strokeStyle = `rgba(193,18,31,${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (!reduced) loop();
    else draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink">
      {/* deep crimson gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 50% 0%, rgba(139,0,0,0.28) 0%, rgba(80,0,0,0.10) 32%, rgba(5,5,6,0) 62%), radial-gradient(60% 50% at 85% 90%, rgba(193,18,31,0.16) 0%, rgba(5,5,6,0) 55%), radial-gradient(50% 40% at 10% 80%, rgba(139,0,0,0.14) 0%, rgba(5,5,6,0) 55%)",
        }}
      />
      {/* perspective grid */}
      <div
        ref={gridRef}
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,46,46,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,46,0.07) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage:
            "radial-gradient(70% 60% at 50% 45%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 45%, #000 30%, transparent 78%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
