import { Users, BookOpen, FileText, LayoutDashboard } from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'coaches', label: 'Coaches', icon: Users },
    { id: 'content', label: 'Financial Literacy', icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-brand-navy min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-[#2a3a5a]">
        <div className="flex items-center gap-3">
          <img src={'logo/NIL Law.svg'} alt="NIL Logo" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-sm">NIL Athlete Law</h2>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeSection === item.id
                  ? 'bg-brand-teal text-brand-dark'
                  : 'text-gray-300 hover:bg-[#2a3a5a]'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
