import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/5 text-xs font-medium text-blue-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Available for new projects
        </div>

        <Text as="h1" className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
          Building <span className="text-muted-foreground">digital</span> experiences that <span className="text-blue-500">matter.</span>
        </Text>

        <Text className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium">
          I'm Dhaafin, a full-stack developer specializing in building state-of-the-art web applications with a focus on design and performance.
        </Text>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button>View My Work</Button>
          <Button variant="secondary">Get in touch</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
