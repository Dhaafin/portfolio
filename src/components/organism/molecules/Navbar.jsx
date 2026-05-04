import Link from 'next/link';
import Text from '@/components/atoms/Text';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-20 md:px-32 py-8">
      <Link href="/" className="group">
        <Text className="text-xl font-black lowercase tracking-tighter">
          dhaafin<span className="text-accent">.</span>
        </Text>
      </Link>
      
      <div className="flex gap-12">
        {['work', 'resume', 'contact'].map((item) => (
          <Link 
            key={item}
            href={`/${item}`} 
            className="text-xs uppercase tracking-[0.2em] font-bold text-muted hover:text-foreground transition-colors duration-500"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}