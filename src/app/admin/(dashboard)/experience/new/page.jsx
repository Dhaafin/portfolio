import Text from "@/components/atoms/Text";
import ExperienceForm from "../components/ExperienceForm";

export const metadata = { title: "New Experience | Admin" };

export default function NewExperiencePage() {
  return (
    <div className="flex flex-col gap-12">
      <header>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Creation Terminal
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          new era<span className="text-accent">.</span>
        </Text>
      </header>

      <ExperienceForm />
    </div>
  );
}
