import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent scroll-smooth custom-scrollbar">
          <div className="container mx-auto p-4 md:p-6 lg:p-10 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
