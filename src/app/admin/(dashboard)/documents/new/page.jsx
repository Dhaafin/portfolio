import DocumentForm from "@/components/organism/admin/DocumentForm";
import Text from "@/components/atoms/Text";
import Link from "next/link";

export const metadata = { title: "New Document | Admin" };

export default function NewDocumentPage() {
  return (
    <div className="flex flex-col gap-12">
      <header>
        <Link 
          href="/admin/documents" 
          className="inline-block mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          ← back to documents.
        </Link>
        <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
          RAG Knowledgebase
        </Text>
        <Text as="h1" className="text-5xl font-black lowercase tracking-tighter text-white">
          new document<span className="text-[#A78BFA]">.</span>
        </Text>
      </header>

      <DocumentForm />
    </div>
  );
}
