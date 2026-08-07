import Text from "@/components/atoms/Text";

const skillsRow1 = [
  "next.js", "react", "typescript", "tailwind", "node.js", "postgresql",
  "next.js", "react", "typescript", "tailwind", "node.js", "postgresql" // Duplicated for seamless loop
];

const skillsRow2 = [
  "framer motion", "figma", "graphql", "docker", "aws", "redis",
  "framer motion", "figma", "graphql", "docker", "aws", "redis" // Duplicated for seamless loop
];

const Skills = () => {
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 mb-12 flex items-center gap-6">
        <div className="h-[1px] w-12 bg-muted/30"></div>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-muted/50">
          stack.
        </Text>
      </div>

      {/* Gradient Masks for fade effect at the edges */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex flex-col gap-6 relative">
        {/* Row 1 */}
        <div className="flex w-max animate-marquee pause-on-hover">
          {skillsRow1.map((skill, index) => (
            <div key={`row1-${index}`} className="flex items-center">
              <span className="text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:1px_var(--color-muted)] opacity-30 hover:opacity-100 hover:text-foreground hover:[-webkit-text-stroke:0px] transition-all duration-500 cursor-default px-8">
                {skill}
              </span>
              <span className="text-accent/30 text-2xl">•</span>
            </div>
          ))}
        </div>

        {/* Row 2 (Moves slightly faster or reversed) */}
        <div className="flex w-max animate-marquee pause-on-hover" style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
          {skillsRow2.map((skill, index) => (
            <div key={`row2-${index}`} className="flex items-center">
              <span className="text-4xl md:text-6xl font-black text-transparent [-webkit-text-stroke:1px_var(--color-muted)] opacity-30 hover:opacity-100 hover:text-foreground hover:[-webkit-text-stroke:0px] transition-all duration-500 cursor-default px-8">
                {skill}
              </span>
              <span className="text-accent/30 text-2xl">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
