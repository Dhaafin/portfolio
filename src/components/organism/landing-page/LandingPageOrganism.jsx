import Hero from "./molecules/Hero";
import GraphExplorer from "./molecules/GraphExplorer";
import ChatbotShowcase from "./molecules/ChatbotShowcase";
import AboutSection from "./molecules/AboutSection";
import { getLandingProjects } from "@/services/projects";
import { getLandingExperiences } from "@/services/experiences";
import { getLandingCertifications } from "@/services/certifications";

const LandingPageOrganism = async () => {
  const [projects, experiences, certifications] = await Promise.all([
    getLandingProjects(),
    getLandingExperiences(),
    getLandingCertifications(),
  ]);

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
          projects={projects || []}
          experiences={experiences || []}
          certifications={certifications || []}
        />
      </section>
    </div>
  );
};

export default LandingPageOrganism;