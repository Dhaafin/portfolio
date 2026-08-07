import Hero from "./molecules/Hero";
import GraphExplorer from "./molecules/GraphExplorer";
import ChatbotShowcase from "./molecules/ChatbotShowcase";
import AboutSection from "./molecules/AboutSection";

const LandingPageOrganism = ({ projects = [], experiences = [], certifications = [] }) => {
  return (
    <div className="bg-background">
      <section id="hero" className="h-screen overflow-hidden">
        <Hero />
      </section>

      <section id="explore">
        <GraphExplorer />
      </section>

      <section id="chatbot">
        <ChatbotShowcase />
      </section>

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