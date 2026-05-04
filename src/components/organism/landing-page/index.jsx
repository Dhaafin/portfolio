import Hero from "./Hero";
import Projects from "./Projects";
import Experience from "./Experience";

const HomePage = () => {
    return (
        <div className="flex flex-col">
            <section id="hero">
                <Hero />
            </section>
            
            <section id="projects">
                <Projects />
            </section>
            
            <section id="experience">
                <Experience />
            </section>
        </div>
    );
};

export default HomePage;

