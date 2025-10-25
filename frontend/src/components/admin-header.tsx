import { Bell, Search, User } from "lucide-react";
import { Input } from "./ui/input";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[#1e2a47]">{title}</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#2dd4bf] rounded-full"></span>
          </button>
          
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-[#1e2a47] rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
