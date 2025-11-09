
import Hero from "./Hero";

const HomePage = () => {
    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">

            <section id="hero">
                <Hero></Hero>
            </section>

        </div>
    );
};

export default HomePage;