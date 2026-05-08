import Text from "@/components/atoms/Text";
import CVUploader from "@/components/organism/admin/CVUploader";

export const metadata = { title: "Settings | Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-12">
      <header>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          Control Center
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter">
          settings<span className="text-white/20">.</span>
        </Text>
      </header>

      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 rounded-full bg-white/20" />
          <Text className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">
            Documents
          </Text>
        </div>

        <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
          <CVUploader />
        </div>
      </section>
    </div>
  );
}
