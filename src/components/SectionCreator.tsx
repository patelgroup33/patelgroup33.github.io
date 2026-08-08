"use client";

import { useRef } from "react";
import { PROJECTS } from "@/data/content";
import { Section, Kicker } from "./ui";

export default function SectionCreator() {
  return (
    <Section id="creator">
      <Kicker
        index="03"
        title="THE CREATOR"
        sub="I don't only build data systems — I build products. Engineered artifacts and the studio that turns them into experiences."
      />

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} featured={i === 0} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({
  project,
  featured,
}: {
  project: (typeof PROJECTS)[number];
  featured?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  // parallax tilt + layer explode via CSS variables on hover
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${px * 30}px`);
    el.style.setProperty("--my", `${py * 30}px`);
  };
  const onLeave = () => {
    const el = ref.current!;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return (
    <a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-reveal
      className={`project-card group relative block overflow-hidden rounded-2xl ${
        featured ? "lg:row-span-1" : ""
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="bracket glass relative flex h-full min-h-[420px] flex-col p-7 transition-shadow duration-500 group-hover:glass-strong">
        <span className="b-bl" />
        <span className="b-br" />

        {/* exploding layers — index, gridlines, glow */}
        <div className="layer layer-1 pointer-events-none absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,46,46,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,46,46,0.10) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>
        <div
          className="layer layer-2 pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 30%, rgba(255,46,46,0.28), transparent 70%)",
          }}
        />

        {/* giant index digit */}
        <div className="layer layer-3 pointer-events-none absolute right-4 top-2 select-none text-[120px] font-bold leading-none text-white/[0.04] transition-transform duration-500 group-hover:text-neon/10">
          {project.index}
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="mono text-[10px] text-neon/70">{project.kind}</span>
          <span className="mono text-[10px] text-white/40">{project.year}</span>
        </div>

        <h3 className="relative z-10 mt-5 text-2xl font-semibold leading-tight text-white">
          {project.title}
        </h3>

        {project.metric && (
          <div className="relative z-10 mt-5 flex items-baseline gap-2">
            <span className="headline text-4xl text-neon text-glow">
              {project.metric.value}
            </span>
            <span className="mono text-[10px] text-white/40">
              {project.metric.label}
            </span>
          </div>
        )}

        <ul className="relative z-10 mt-6 space-y-3">
          {project.lines.slice(0, featured ? 4 : 3).map((l, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-white/60">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-neon" />
              <span>{l}</span>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto pt-6">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-silver/70"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mono mt-5 flex items-center gap-2 text-[11px] text-neon opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            OPEN REPOSITORY →
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-card {
          transform: perspective(1000px) rotateX(var(--rx, 0)) rotateY(var(--ry, 0));
          transition: transform 0.25s ease;
        }
        .layer-1 {
          transform: translate3d(calc(var(--mx, 0) * 0.4), calc(var(--my, 0) * 0.4), 40px);
        }
        .layer-3 {
          transform: translate3d(calc(var(--mx, 0) * -0.8), calc(var(--my, 0) * -0.8), 60px);
        }
      `}</style>
    </a>
  );
}
