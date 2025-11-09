import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    My App
                </Link>
                <div>
                    <Link href="/about" className="mr-4 hover:text-gray-300">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-gray-300">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}