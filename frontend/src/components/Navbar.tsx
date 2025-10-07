import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="p-3 bg-gray-100 flex gap-4 border-b">
      <Link href="/" className="text-gray-800 hover:text-pink-500 hover:underline font-medium">
        Home
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/login" className="text-gray-800 hover:text-pink-500 hover:underline font-medium">
        Login
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/about" className="text-gray-800 hover:text-pink-500 hover:underline font-medium">
        About
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/profile" className="text-gray-800 hover:text-pink-500 hover:underline font-medium">
        Profile
      </Link>
      <span className="text-gray-400">|</span>
      <Link href="/signup" className="text-gray-800 hover:text-pink-500 hover:underline font-medium">
        SignUp
      </Link>
    </nav>
  );
}