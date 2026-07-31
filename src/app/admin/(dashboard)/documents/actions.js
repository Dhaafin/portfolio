"use server";

import { db } from "@/lib/db/index.js";
import { documents } from "@/lib/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDocument(formData) {
  const id = crypto.randomUUID();

  const docData = {
    id,
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category") || "general",
  };

  try {
    await db.insert(documents).values(docData);
  } catch (error) {
    console.error("Error creating document:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/documents");
  redirect("/admin/documents");
}

export async function updateDocument(id, formData) {
  const docData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category") || "general",
  };

  try {
    await db.update(documents).set(docData).where(eq(documents.id, id));
  } catch (error) {
    console.error("Error updating document:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/documents");
  redirect("/admin/documents");
}

export async function deleteDocument(id) {
  try {
    await db.delete(documents).where(eq(documents.id, id));
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/documents");
}
