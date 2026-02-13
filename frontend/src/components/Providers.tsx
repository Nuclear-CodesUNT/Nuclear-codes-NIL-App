"use client";
import dynamic from "next/dynamic";
import { AuthProvider } from "../contexts/AuthContext";
import type { ReactNode } from "react";

const NavBar = dynamic(() => import("./Navbar"), { ssr: false });

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <main>{children}</main>
    </AuthProvider>
  );
}