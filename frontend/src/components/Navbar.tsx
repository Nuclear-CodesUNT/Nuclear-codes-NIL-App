import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="sticky top-0 flex justify-between items-center bg-white px-6 py-4 shadow-md border-b border-gray-300">
      {/* Left side - Logo will go here + about and profile for now */}
      <div className="flex items-center gap-6">
        {/* Nav bar title */}
        <Link href="/" className="text-xl font-bold text-black">
          <img
            src="/logo/NIL Law.svg"
            alt="NIL Law Logo"
            className="rounded-md h-10 w-10 object-contain"
          />
        </Link>
        
        <div className="flex gap-4">
          <Link
            href="/about"
            className="flex items-center gap-2 text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <span>About</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <span>Profile</span>
          </Link>
        </div>
      </div>

      {/* Right side aligned */}
      <div className="flex gap-4">
        {/* Sign Up Button */}
        <Link
          href="/signup"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <span>Get Started</span>
        </Link>

        {/* Login Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <span>Sign In</span>
        </Link>
      </div>
    </nav>
  );
}