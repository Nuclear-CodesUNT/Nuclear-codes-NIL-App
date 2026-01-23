import Image from 'next/image';
import Link from 'next/link';

export default function Videos() {
  return (
    <div className="min-h-screen">
        {/* Left Side Bar */}
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <Image src="1e4c87e99332bc3bffa82e8dfec49bc4433f04aa.png" alt="NIL Logo" className="w-10 h-10"/>
                <div>
                    <h3 className="text-sm text-white">NIL Athlete Law</h3>
                    <p className="text-xs text-white/80">@jdavis_athlete</p>
                </div>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-primary text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide 
                lucide-book-open w-5 h-5" aria-hidden="true">
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 
                    1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>Financial Literacy</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 
            rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                className="lucide lucide-layout-dashboard w-5 h-5" aria-hidden="true">
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            <span>Dashboard</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground 
            hover:bg-sidebar-accent">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide 
            lucide-users w-5 h-5" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
        </svg>
            <span>Players</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground 
            hover:bg-sidebar-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide 
                lucide-circle-user w-5 h-5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="10" r="3"></circle>
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
            </svg>
            <span>Coaches</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors 
            text-sidebar-foreground hover:bg-sidebar-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            className="lucide lucide-file-text w-5 h-5" aria-hidden="true">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
            </svg>
            <span>Contracts</span>
        </button>
        </nav>
    
    </div>
    </div>
  );
}