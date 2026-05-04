import Text from "@/components/atoms/Text";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* The Luxury Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blob blur-[120px] -z-10 animate-pulse duration-[10s]" />
      
      <div className="space-y-4">
        <Text 
          as="h1" 
          className="text-7xl md:text-9xl font-black tracking-tighter lowercase leading-none"
        >
          hello world<span className="text-accent">.</span>
        </Text>
        
        <Text className="text-damp text-lg md:text-xl font-medium tracking-wide">
          building things.
        </Text>
      </div>
    </div>
  );
};

export default Hero;
