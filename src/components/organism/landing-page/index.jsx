import Hero from "./Hero";
import GraphExplorer from "./GraphExplorer";

const HomePage = () => {
    return (
        <div className="flex flex-col">
            <section id="hero">
                <Hero />
            </section>
            
            <section id="explorer">
                <GraphExplorer />
            </section>
        </div>
    );
};

export default HomePage;