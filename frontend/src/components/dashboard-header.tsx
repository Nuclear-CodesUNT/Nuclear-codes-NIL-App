import { Bell, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';


export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <h1 className="text-[#1F2642]">NIL Athlete Law and Finance</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search athletes, posts..." 
              className="pl-10 w-64 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-[#1F2642] hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-[#1F2642] hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
