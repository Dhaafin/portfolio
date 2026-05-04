import './globals.css';
import { Inter, Jost } from 'next/font/google';
import Navbar from '@/components/organism/molecules/Navbar';
import Footer from '@/components/organism/molecules/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });

export const metadata = {
  title: "Dhaafin | Full-stack Developer",
  description: "Specializing in building state-of-the-art web applications with a focus on design and performance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jost.variable} font-sans bg-mesh min-h-screen selection:bg-accent/30 flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}