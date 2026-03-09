"use client";

import { useState } from "react";
import { AdminSidebar } from "../../components/admin-sidebar"; 
import { AdminHeader } from "../../components/admin-header";
import { DashboardOverview } from "../../components/dashboard-overview";
import { PlayersTable } from "../../components/players-table";
import { CoachesTable } from "../../components/coaches-table";
import { ContentManager } from "../../components/content-manager";
import { ContractsTable } from "../../components/contracts-table";

export default function App() {
  const [activeSection, setActiveSection] = useState("contracts");

  const getSectionTitle = () => {
    switch (activeSection) {
      case "contracts":
        return "Contract Management";
      case "dashboard":
        return "Dashboard";
      case "players":
        return "Player Management";
      case "coaches":
        return "Coach Management";
      case "content":
        return "Financial Literacy Content";
      default:
        return "Dashboard";
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "contracts":
        return <ContractsTable />;
      case "dashboard":
        return <DashboardOverview />;
      case "players":
        return <PlayersTable />;
      case "coaches":
        return <CoachesTable />;
      case "content":
        return <ContentManager />;
      default:
        return <DashboardOverview />;
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
