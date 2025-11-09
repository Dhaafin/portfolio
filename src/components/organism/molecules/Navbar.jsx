import Link from 'next/link';
import Text from '@/components/atoms/Text';

import { cn } from '@sglara/cn';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className={cn(
                "container flex justify-between items-center",
                "max-w-[1200px] mx-auto"

            )}>
                {/* Home Page */}
                <Link href="/">
                    <Text font='inter' className='text-2xl font-semibold text-white hover:underline transition-all duration-100'>
                        Dhaafin.
                    </Text>
                </Link>
                <div className='flex flex-row gap-4'>
                    <Link href="/about" className="hover:text-gray-300">
                        Resume
                    </Link>
                    <Link href="/contact" className="hover:text-gray-300">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}