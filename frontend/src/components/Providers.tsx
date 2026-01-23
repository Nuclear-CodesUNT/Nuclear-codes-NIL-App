"use client";
import { AuthProvider } from "../contexts/AuthContext";
import NavBar from "./Navbar";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <main>{children}</main>
    </AuthProvider>
  );
}