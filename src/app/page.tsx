import SmoothScroll from "@/components/SmoothScroll";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import HudOverlay from "@/components/HudOverlay";
import Hero from "@/components/Hero";
import SectionInit from "@/components/SectionInit";
import SectionEngineer from "@/components/SectionEngineer";
import SectionCreator from "@/components/SectionCreator";
import SectionExperience from "@/components/SectionExperience";
import SectionMetrics from "@/components/SectionMetrics";
import SectionProcess from "@/components/SectionProcess";
import SectionContact from "@/components/SectionContact";

export default function Page() {
  return (
    <SmoothScroll>
      <Background />
      <Cursor />
      <HudOverlay />

      <main className="relative">
        <Hero />

        {/* transition seam — the boot section rises out of the hero's collapse */}
        <div className="relative z-10 bg-gradient-to-b from-transparent via-ink/80 to-ink">
          <SectionInit />
          <SectionEngineer />
          <SectionCreator />
        </div>

        <SectionExperience />

        <div className="relative z-10 bg-gradient-to-b from-ink via-ink/90 to-ink">
          <SectionMetrics />
          <SectionProcess />
          <SectionContact />
        </div>
      </main>

      {/* global overlays */}
      <div className="grain" />
      <div className="vignette" />
    </SmoothScroll>
  );
}
