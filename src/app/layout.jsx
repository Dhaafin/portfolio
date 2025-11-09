import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/organism/landing-page/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Awesome App',
  description: 'A layout for the entire application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />

        <main className="container mx-auto p-4">
          {children}
        </main>

      </body>
    </html>
  );
}