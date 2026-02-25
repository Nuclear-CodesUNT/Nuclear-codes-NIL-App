"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "../../components/admin-sidebar"; 
import { AdminHeader } from "../../components/admin-header";
import { UsersTable } from "../../components/users-table";
import { ContractsTable } from "../../components/contracts-table";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function App() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("contracts");

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== 'admin' && user.role !== 'lawyer')) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== 'admin' && user.role !== 'lawyer')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#2dd4bf]" size={48} />
      </div>
    );
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "contracts":
        return "Contract Management";
      case "users":
        return "Users";
      default:
        return "Admin panel";
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "contracts":
        return <ContractsTable />;
      case "users":
        return <UsersTable />;
      // default:
      //   return <ContractsTable />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1">
        <AdminHeader title={getSectionTitle()} />
        
        <main className="p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
