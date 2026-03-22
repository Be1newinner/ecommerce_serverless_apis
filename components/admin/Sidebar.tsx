"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Image as ImageIcon, 
  MessageSquare, 
  Building2, 
  ChevronDown, 
  X,
  LayoutDashboard,
  Tag,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Companies', href: '/admin/companies', icon: Building2 },
  {
    label: 'Catalog',
    icon: Package,
    submenu: [
      { label: 'Products', href: '/admin/products' },
      { label: 'Categories', href: '/admin/categories' },
    ],
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    submenu: [
      { label: 'Manage Orders', href: '/admin/orders' },
      { label: 'Tracking', href: '/admin/tracking' },
    ],
  },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Customers', href: '/admin/users', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transition-all duration-300 ease-in-out lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-3xl">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                A
              </div>
              <span className="text-lg font-bold tracking-tight">AutoPart Admin</span>
            </Link>
            <Button 
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasSubmenu = !!item.submenu;
              const isSubmenuOpen = openSubmenus.includes(item.label);

              return (
                <div key={item.label}>
                  {hasSubmenu ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl transition-all group active:scale-[0.98]",
                          isSubmenuOpen 
                            ? "text-primary bg-primary/5 shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className={cn("h-5 w-5 transition-colors", isSubmenuOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 opacity-60", isSubmenuOpen && "rotate-180 opacity-100")} />
                      </button>
                      
                      {isSubmenuOpen && (
                        <div className="ml-5 pl-4 border-l border-border/50 space-y-1 animate-in slide-in-from-top-2 duration-300">
                          {item.submenu?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  className={cn(
                                    "block px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.98]",
                                    isSubActive 
                                      ? "text-primary bg-primary/10 font-bold" 
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  )}
                                >
                                  {sub.label}
                                </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all group active:scale-[0.98]",
                        isActive 
                          ? "text-primary bg-primary/10 shadow-sm border border-primary/10" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {Icon && <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-muted/20">
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-background shadow-sm border border-border/40">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                   <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-xs font-bold leading-tight truncate uppercase tracking-widest opacity-60">System Health</p>
                   <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <p className="text-[10px] font-bold text-foreground/80">Operational</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}
