"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navLinkClass = (path: string) => {
    const base = "flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-200 transition relative";
    const active = "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white";
    return pathname === path ? `${base} ${active}` : base;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"}/api/auth/logout`,
        { method: "POST", credentials: "include" }
      );
      if (res.ok) {
        logout();
        router.push("/login");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-brand-navy px-6 py-2 shadow-md">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-black">
          <Image src="/logo/NIL Law.svg" alt="NIL Law Logo" width={80} height={80} className="rounded-md object-contain" />
        </Link>
        <div className="flex gap-4">
          <Link href="/about" className={navLinkClass("/about")}>
            <span>About</span>
          </Link>
          {user && user.role && (
            <>
              <Link href="/profile" className={navLinkClass("/profile")}>
                <span>Profile</span>
              </Link>
              {(user.role === 'admin' || user.role === 'lawyer') && (
                <Link href="/admin-portal" className={navLinkClass("/admin-portal")}>
                  <span>Admin Portal</span>
                </Link>
              )}
              <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                <span>Dashboard</span>
              </Link>
              <Link href="/contracts" className={navLinkClass("/contracts")}>
                <span>Contracts</span>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : !loading ? (
          <>
            <Link
              href="/signup"
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}