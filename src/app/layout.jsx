import "./globals.css";
import { Inter, Jost, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/organism/molecules/Navbar";
import Footer from "@/components/organism/molecules/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-cormorant",
});

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ChatbotWidget from "@/components/organism/ChatbotWidget";

export const metadata = {
  title: "Dhaafin | Full-stack Developer",
  description:
    "Specializing in building state-of-the-art web applications with a focus on design and performance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jost.variable} ${cormorant.variable} font-sans bg-mesh min-h-screen selection:bg-accent/30 flex flex-col`}
      >
        <SmoothScrollProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
          <ChatbotWidget />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
