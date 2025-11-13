import { Button } from "./ui/button";
import { Menu, MessageSquare, User, Briefcase, Users, Mail, LayoutList } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">NIL Connect</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-[#1E3A8A]">
              <Users className="h-4 w-4 mr-2" />
              For Athletes
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-[#1E3A8A]">
              <Briefcase className="h-4 w-4 mr-2" />
              For Brands
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-[#1E3A8A]">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Feed Button */}
            <Button variant="ghost" size="icon">
              <LayoutList className="h-5 w-5" />
            </Button>

            {/* Messages Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-medium">Nike Athletics</span>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      We'd love to discuss a partnership opportunity with you...
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-medium">Gatorade</span>
                      <span className="text-xs text-muted-foreground">5h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Your application has been approved! Let's schedule a call...
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-medium">Local Sports Store</span>
                      <span className="text-xs text-muted-foreground">1d ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Thank you for your interest. We have a new campaign...
                    </p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center justify-center text-[#1E3A8A] cursor-pointer">
                  View All Messages
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Briefcase className="mr-2 h-4 w-4" />
                  My Deals
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="bg-[#1E3A8A] hover:bg-[#1E2F5A]">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}