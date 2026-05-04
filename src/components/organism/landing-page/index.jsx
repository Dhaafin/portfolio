
import Hero from "./Hero";
import Projects from "./Projects";

const HomePage = () => {
    return (
        <div className="flex flex-col">
            <section id="hero">
                <Hero />
            </section>
            
            <section id="projects">
                <Projects />
            </section>
        </div>
    );
};

export default HomePage;
