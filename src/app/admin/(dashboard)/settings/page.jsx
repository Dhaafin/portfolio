import CVUploader from "@/components/organism/admin/CVUploader";
import AISettingsCard from "@/components/organism/admin/AISettingsCard";
import { getAISettings } from "@/services/aiSettings.js";

export const metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  const aiSettings = await getAISettings();

  return (
    <div className="flex flex-col gap-10">
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
          Settings
        </h1>
        <p className="text-xs text-muted font-normal mt-1">
          AI assistant configuration and curriculum vitae upload
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-wider text-muted font-normal">
          AI Assistant Configuration
        </h2>

        <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <AISettingsCard initialSettings={aiSettings} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-wider text-muted font-normal">
          Curriculum Vitae (CV)
        </h2>

        <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <CVUploader />
        </div>
      </section>
    </div>
  );
}
