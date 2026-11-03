import { db } from "@/lib/db/index.js";
import Link from "next/link";
import DeleteDocumentButton from "@/components/organism/admin/DeleteDocumentButton";

export const metadata = { title: "Documents | Admin" };

export default async function AdminDocumentsPage() {
  const docs = await db.query.documents.findMany({
    orderBy: (documents, { desc }) => [desc(documents.created_at)],
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Documents
          </h1>
          <p className="text-xs text-muted font-normal mt-1">
            Manage knowledgebase context for the AI chatbot
          </p>
        </div>

        <Link
          href="/admin/documents/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-xs font-normal hover:bg-neutral-200 transition-colors self-start sm:self-auto"
        >
          + New Document
        </Link>
      </header>

      <div>
        {!docs || docs.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted font-normal mb-3">
              No documents found.
            </p>
            <Link
              href="/admin/documents/new"
              className="text-xs font-normal text-primary hover:underline"
            >
              Add your first document.
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted font-normal">
                      {doc.category || "General"}
                    </span>
                    <h2 className="text-sm font-medium text-white leading-snug mt-0.5">
                      {doc.title}
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-muted/80 line-clamp-3 leading-relaxed font-normal">
                  {doc.content}
                </p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  <Link
                    href={`/admin/documents/edit/${doc.id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-normal transition-colors text-center"
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
