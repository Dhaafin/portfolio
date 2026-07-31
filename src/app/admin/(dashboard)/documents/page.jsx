import { db } from "@/lib/db/index.js";
import Text from "@/components/atoms/Text";
import Link from "next/link";
import DeleteDocumentButton from "@/components/organism/admin/DeleteDocumentButton";

export const metadata = { title: "Manage Documents | Admin" };

export default async function AdminDocumentsPage() {
  const docs = await db.query.documents.findMany({
    orderBy: (documents, { desc }) => [desc(documents.created_at)],
  });

  const nodeColor = "#A78BFA"; // Violet

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-end justify-between">
        <div>
          <Text className="text-xs tracking-[0.3em] uppercase font-bold text-white/40 mb-2">
            RAG Knowledgebase
          </Text>
          <Text as="h1" className="text-5xl font-black lowercase tracking-tighter text-white">
            documents<span style={{ color: nodeColor }}>.</span>
          </Text>
        </div>

        <Link
          href="/admin/documents/new"
          className="px-8 py-3 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          add document.
        </Link>
      </header>

      <div>
        {!docs || docs.length === 0 ? (
          <div className="p-24 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <Text className="text-muted/50 mb-4">No documents found in the database.</Text>
            <Link href="/admin/documents/new" className="text-xs font-bold uppercase tracking-widest text-[#A78BFA] hover:underline">
              Add your first RAG document.
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docs.map((doc) => (
              <div key={doc.id} className="p-6 bg-white/2 border border-white/10 rounded-2xl flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <Text className="text-xs tracking-widest uppercase font-bold text-white/30">
                      {doc.category}
                    </Text>
                    <Text className="text-lg font-bold text-white leading-snug">
                      {doc.title}
                    </Text>
                  </div>
                </div>
                <Text className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                  {doc.content}
                </Text>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                  <Link
                    href={`/admin/documents/edit/${doc.id}`}
                    className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all text-center"
                  >
                    Edit
                  </Link>
                  <DeleteDocumentButton id={doc.id} title={doc.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
