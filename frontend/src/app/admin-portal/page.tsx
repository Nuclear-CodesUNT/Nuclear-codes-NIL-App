"use client";

import { useState } from "react";
import { AdminSidebar } from "../../components/admin-sidebar"; 
import { AdminHeader } from "../../components/admin-header";
import { UsersTable } from "../../components/users-table";
import { ContractsTable } from "../../components/contracts-table";

export default function App() {
  const [activeSection, setActiveSection] = useState("contracts");

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
