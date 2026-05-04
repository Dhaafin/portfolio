import Link from 'next/link';
import Text from '@/components/atoms/Text';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-24 md:px-48 lg:px-64 py-8 pointer-events-none">
      <Link href="/" className="pointer-events-auto group">
        <Text className="text-xl font-black lowercase tracking-tighter text-foreground group-hover:opacity-70 transition-opacity duration-500">
          dhaafin<span className="text-accent">.</span>
        </Text>
      </Link>
      {/* "explore." trigger is rendered via NavOverlay — positioned separately */}
    </nav>
  );
}