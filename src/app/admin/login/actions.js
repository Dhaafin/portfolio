"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signJWT, hashPassword } from "@/lib/auth.js";

export async function login(formData) {
  const username = formData.get("email"); // Admin form uses email input for username
  const password = formData.get("password");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi" };
  }

  // Calculate high-security PBKDF2 hash using ADMIN_SECRET_KEY as salt
  const inputHash = await hashPassword(password, process.env.ADMIN_SECRET_KEY);

  const correctUsername = process.env.ADMIN_USERNAME;
  const correctHash = process.env.ADMIN_PASSWORD_HASH;

  if (username !== correctUsername || inputHash !== correctHash) {
    return { error: "Username atau password salah" };
  }

  // Create JWT session
  const token = await signJWT({ role: "admin" }, process.env.ADMIN_SECRET_KEY);

  // Set highly secure HttpOnly session cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600, // 7 days expiration
  });

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
