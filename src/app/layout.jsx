import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/organism/molecules/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "Dhaafin | Full-stack Developer",
  description: "Specializing in building state-of-the-art web applications with a focus on design and performance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-mesh min-h-screen`}>
        <Navbar />
        <main className="relative pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}