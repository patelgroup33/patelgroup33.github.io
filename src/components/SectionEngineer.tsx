"use client";

import { ENGINEER } from "@/data/content";
import { Section, Kicker, Reveal } from "./ui";

export default function SectionEngineer() {
  return (
    <Section id="engineer">
      <Kicker
        index="02"
        title="THE ENGINEER"
        sub="Systems-level thinking from embedded control units to zero-allocation hot paths. Built, benchmarked, verified."
      />

      <div className="grid gap-6 md:grid-cols-12">
        {/* Education panel */}
        <Reveal className="md:col-span-5">
          <div className="bracket glass-strong glass relative flex h-full flex-col rounded-2xl p-7">
            <span className="b-bl" />
            <span className="b-br" />
            <div className="mono text-[10px] text-neon/70">EDUCATION</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">
              {ENGINEER.education.school}
            </h3>
            <p className="mt-1 text-sm text-white/50">
              {ENGINEER.education.faculty}
            </p>
            <p className="mt-4 text-lg text-silver">
              {ENGINEER.education.degree}
            </p>
            <p className="mono mt-1 text-[11px] text-white/40">
              {ENGINEER.education.detail}
            </p>

            <div className="my-6 h-px w-full bg-gradient-to-r from-neon/40 to-transparent" />

            <div className="flex items-end gap-3">
              <div className="headline text-6xl text-neon text-glow">
                {ENGINEER.education.gpa.split(" ")[0]}
              </div>
              <div className="mono mb-2 text-[10px] text-white/40">
                / 4.0 GPA
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {ENGINEER.education.honors.map((h) => (
                <span
                  key={h}
                  className="mono rounded-full border border-neon/25 bg-neon/5 px-3 py-1 text-[10px] text-silver"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Skills matrix */}
        <Reveal className="md:col-span-7">
          <div className="bracket glass relative h-full rounded-2xl p-7">
            <span className="b-bl" />
            <span className="b-br" />
            <div className="mono text-[10px] text-neon/70">CAPABILITY MATRIX</div>
            <div className="mt-6 space-y-6">
              {Object.entries(ENGINEER.skills).map(([group, items]) => (
                <div key={group}>
                  <div className="mono mb-3 text-[10px] text-white/40">
                    {group}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span
                        key={s}
                        data-cursor
                        className="skill-chip rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-silver transition-all duration-200 hover:border-neon/60 hover:bg-neon/10 hover:text-white"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Certifications */}
        <Reveal className="md:col-span-12">
          <div className="bracket glass relative rounded-2xl p-7">
            <span className="b-bl" />
            <span className="b-br" />
            <div className="mono text-[10px] text-neon/70">CERTIFICATIONS</div>
            <div className="mt-5 space-y-4">
              {ENGINEER.certifications.map((c) => (
                <a
                  key={c.title}
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-neon/50 hover:bg-neon/[0.06] sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="mono flex-shrink-0 rounded border border-neon/40 bg-neon/10 px-2 py-1 text-[10px] font-semibold tracking-widest text-neon">
                        IBM
                      </span>
                      <h4 className="text-lg font-semibold leading-tight text-white">
                        {c.title}
                      </h4>
                    </div>
                    <p className="mono mt-2 text-[11px] text-white/40">
                      {c.issuer} · {c.date} · {c.courses}
                    </p>
                    <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-white/55">
                      {c.detail}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-silver/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mono flex-shrink-0 whitespace-nowrap text-[11px] text-neon opacity-70 transition-opacity group-hover:opacity-100">
                    VERIFY CREDENTIAL →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Coursework ticker */}
        <Reveal className="md:col-span-12">
          <div className="bracket glass relative overflow-hidden rounded-2xl p-5">
            <span className="b-bl" />
            <span className="b-br" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="mono text-[10px] text-neon/70">COURSEWORK //</span>
              {ENGINEER.coursework.map((c) => (
                <span key={c} className="text-xs text-white/55">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
