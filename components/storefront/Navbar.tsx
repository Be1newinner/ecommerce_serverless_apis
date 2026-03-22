"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            A
          </div>
          <span className="text-xl font-bold tracking-tight">AutoPart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">Categories</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Admin</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full border-b bg-background p-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            <Link href="/products" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link href="/categories" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link href="/about" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/admin" className="text-lg font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
            <hr />
            <div className="flex items-center gap-4">
               <Button className="flex-1">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
