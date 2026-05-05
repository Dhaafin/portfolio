import Hero from "./Hero";
import GraphExplorer from "./GraphExplorer";
import AboutSection from "./AboutSection";

const HomePage = ({ projects = [], experiences = [], certifications = [] }) => {
  return (
    <div className="bg-background">
      {/* Section 1: Hero — full viewport cinematic entrance */}
      <section id="hero" className="h-screen overflow-hidden">
        <Hero />
      </section>

      {/* Section 2: Astral Hub — the navigation graph */}
      <section id="explore">
        <GraphExplorer />
      </section>

      {/* Section 3: Identity Archive — about + records briefs */}
      <section id="identity">
        <AboutSection
          projects={projects}
          experiences={experiences}
          certifications={certifications}
        />
      </section>
    </div>
  );
};

export default HomePage;