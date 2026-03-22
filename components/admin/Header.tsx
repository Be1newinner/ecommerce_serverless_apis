"use client";

import { Bell, Search, Menu, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative hidden md:flex items-center w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full rounded-xl border bg-muted/30 py-2 pl-10 pr-4 text-sm outline-none ring-primary/20 transition-all focus:border-primary focus:bg-background focus:ring-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full transition-all active:scale-95">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
        </Button>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold tracking-tight">{user?.name || 'Admin'}</p>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{user?.role || 'Administrator'}</p>
          </div>
          
          <div className="relative group">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary ring-2 ring-transparent transition-all group-hover:ring-primary/20 overflow-hidden active:scale-90">
               {user?.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
               ) : (
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
               )}
            </button>
            
            {/* Premium Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right translate-y-2 rounded-2xl border bg-popover p-2 shadow-xl opacity-0 invisible transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible z-50">
               <div className="px-3 py-2 border-b border-border/50 mb-1 sm:hidden">
                  <p className="text-sm font-bold truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@store.com'}</p>
               </div>
               <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors group/item">
                  <UserIcon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                  Profile Settings
               </button>
               <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors group/item">
                  <Settings className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                  System Logs
               </button>
               <div className="mt-1 border-t border-border/50 pt-1">
                  <button 
                     onClick={() => logout()}
                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                   >
                     <LogOut className="h-4 w-4" />
                     Sign Out
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
