import CVDownloadButton from "@/components/organism/about/CVDownloadButton";

export const metadata = { title: "About | Dhaafin" };

const CV_URL = "/cv";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-48">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-16">

        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase font-bold text-white/20 mb-6">
            who i am.
          </p>
          <h1 className="text-7xl md:text-9xl font-black lowercase tracking-tighter leading-none">
            about<span className="text-accent">.</span>
          </h1>
          <p className="text-white/30 text-lg font-medium mt-6 lowercase">
            coming soon — full bio dropping shortly.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* CV Download */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/20">
            In the meantime
          </p>
          <CVDownloadButton url={CV_URL} />
        </div>

      </div>
    </div>
  );
}
