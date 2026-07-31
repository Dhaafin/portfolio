import DocumentForm from "@/components/organism/admin/DocumentForm";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import { db } from "@/lib/db/index.js";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Document | Admin" };

export default async function EditDocumentPage({ params }) {
  const { id } = await params;

  const doc = await db.query.documents.findFirst({
    where: (documents, { eq }) => eq(documents.id, id),
  });

  if (!doc) {
    notFound();
  }

  const nodeColor = "#A78BFA"; // Violet

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
          edit document<span style={{ color: nodeColor }}>.</span>
        </Text>
      </header>

      <DocumentForm document={doc} />
    </div>
  );
}
