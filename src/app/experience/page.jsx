import Text from "@/components/atoms/Text";

export const metadata = { title: "Experience | Dhaafin" };

export default function ExperiencePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-24 md:px-48 lg:px-64">
      <div className="max-w-[900px] mx-auto w-full">
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-muted/50 mb-8">where i've been.</Text>
        <Text as="h1" className="text-7xl md:text-9xl font-black lowercase tracking-tighter leading-none">
          experience<span className="text-accent">.</span>
        </Text>
        <Text className="text-muted text-xl mt-8 font-medium">coming soon.</Text>
      </div>
    </div>
  );
}
