import Hero from "./Hero";
import GraphExplorer from "./GraphExplorer";
import ChatbotShowcase from "./ChatbotShowcase";
import AboutSection from "./AboutSection";

const LandingPageOrganism = ({ projects = [], experiences = [], certifications = [] }) => {
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

      {/* Section 3: Chatbot Showcase — AI assistant feature reveal */}
      <section id="chatbot">
        <ChatbotShowcase />
      </section>

      {/* Section 4: Identity Archive — about + records briefs */}
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

export default LandingPageOrganism;