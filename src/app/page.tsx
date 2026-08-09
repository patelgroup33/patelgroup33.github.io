import SmoothScroll from "@/components/SmoothScroll";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import HudOverlay from "@/components/HudOverlay";
import Hero from "@/components/Hero";
import SectionEngineer from "@/components/SectionEngineer";
import SectionCreator from "@/components/SectionCreator";
import SectionExperience from "@/components/SectionExperience";
import SectionMetrics from "@/components/SectionMetrics";
import SectionProcess from "@/components/SectionProcess";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <Background />
      <Cursor />
      <HudOverlay />

      <main className="relative">
        <Hero />

        {/* the avatar scrolls away and the content rises over the living backdrop */}
        <div className="relative z-10 bg-gradient-to-b from-transparent via-ink/80 to-ink">
          <SectionEngineer />
          <SectionCreator />
        </div>

        <SectionExperience />

        <div className="relative z-10 bg-gradient-to-b from-ink via-ink/90 to-ink">
          <SectionMetrics />
          <SectionProcess />
        </div>

        <Footer />
      </main>

      {/* global overlays */}
      <div className="grain" />
      <div className="vignette" />
    </SmoothScroll>
  );
}
