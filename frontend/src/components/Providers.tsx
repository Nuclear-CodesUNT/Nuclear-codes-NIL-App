"use client";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

const NavBar = dynamic(() => import("./Navbar"), { ssr: false });

const PUBLIC_ROUTES = ["/", "/about", "/login", "/signup", "/forgot-password", "/reset-password"];

function RouteGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/");
    }
  }, [loading, user, isPublic, router]);

  if (loading) return null;
  if (!user && !isPublic) return null;

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <RouteGuard>{children}</RouteGuard>
      </main>
    </AuthProvider>
  );
}