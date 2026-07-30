import { NextResponse } from "next/server";
import { verifyJWT } from "./lib/auth.js";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get("admin_session")?.value;
  const session = token ? await verifyJWT(token, process.env.ADMIN_SECRET_KEY) : null;

  // Unauthenticated → block all /admin/* except /admin/login
  if (isAdminRoute && !isLoginPage && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Already authenticated → redirect away from login page
  if (isLoginPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
