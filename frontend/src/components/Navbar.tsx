'use client'
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const navLinkClass = (path: string) => {
    const baseClass = "flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-200 transition relative";
    const activeClass = "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white";
    return pathname === path ? `${baseClass} ${activeClass}` : baseClass;
  };
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-brand-navy px-6 py-2 shadow-md">
      <div className="flex items-center gap-6">
        {/* Nav bar logo */}
        <Link href="/" className="text-xl font-bold text-black">
           <Image
            src="/logo/NIL Law.svg"
            alt="NIL Law Logo"
            width={80}
            height={80}
            className="rounded-md object-contain"
          />
       
        </Link>
        {/* tabs */}
        <div className="flex gap-4">
          <Link
            href="/about"
            className={navLinkClass('/about')}
          >
            <span>About</span>
          </Link>
          <Link
            href="/profile"
            className={navLinkClass('/profile')}
          >
            <span>Profile</span>
          </Link>
          <Link
            href="/admin-portal"
            className={navLinkClass('/admin-portal')}
          >
            <span>Admin Portal</span>
          </Link>
          <Link
            href="/dashboard"
            className={navLinkClass('/dashboard')}
          >
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      
      <div className="flex gap-4">
        {/* Sign Up Button */}
        <Link
          href="/signup"
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
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