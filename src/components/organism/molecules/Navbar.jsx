import Link from 'next/link';
import Text from '@/components/atoms/Text';
import { cn } from '@sglara/cn';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="glass px-8 py-3 rounded-full flex justify-between items-center w-full max-w-[1200px] border-white/10">
        <Link href="/" className="group">
          <Text font='inter' className='text-xl font-bold tracking-tighter text-foreground group-hover:opacity-80 transition-opacity'>
            Dhaafin<span className="text-blue-500">.</span>
          </Text>
        </Link>
        
        <div className='flex items-center gap-8'>
          {['Projects', 'Resume', 'Contact'].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}