import Text from "@/components/atoms/Text";
import CVDownloadButton from "@/components/organism/about/CVDownloadButton";

export const metadata = { title: "About | Dhaafin" };

const CV_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/resume.pdf`;

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-24 md:px-48 lg:px-64">
      <div className="max-w-[900px] mx-auto w-full">
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-muted/50 mb-8">who i am.</Text>
        <Text as="h1" className="text-7xl md:text-9xl font-black lowercase tracking-tighter leading-none">
          about<span className="text-accent">.</span>
        </Text>
        <Text className="text-muted text-xl mt-8 font-medium">coming soon.</Text>

        <div className="mt-16">
          <CVDownloadButton url={CV_URL} />
        </div>
      </div>
    </div>
  );
}
