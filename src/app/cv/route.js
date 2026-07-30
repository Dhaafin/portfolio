import { NextResponse } from "next/server";

export async function GET() {
  const storeId = process.env.PORTFOLIO_STORE_ID?.replace("store_", "") || "Y2JE1JcU9w20ebpP";
  const cvUrl = `https://${storeId}.public.blob.vercel-storage.com/cv/resume.pdf`;
  
  return NextResponse.redirect(cvUrl, {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
