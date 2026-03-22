import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold tracking-tight">AutoPart</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted partner for high-performance automotive parts. We provide premium components for domestic and import vehicles with global shipping and expert support.
            </p>
            <div className="flex items-center gap-4">
               <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                  <Facebook className="h-5 w-5" />
               </Link>
               <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                  <Twitter className="h-5 w-5" />
               </Link>
               <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                  <Instagram className="h-5 w-5" />
               </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Shop Categories</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Engine Parts</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Brakes & Steering</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Suspension</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Electrical Systems</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Performance Tuning</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Customer Support</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Bulk Orders</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center & FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 tracking-tight">Contact Us</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 shrink-0 text-primary" />
                 <span>123 Performance Way, Industrial Hub, Pune 411001</span>
              </li>
              <li className="flex items-center gap-3">
                 <Phone className="h-5 w-5 shrink-0 text-primary" />
                 <span>+91 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                 <Mail className="h-5 w-5 shrink-0 text-primary" />
                 <span>support@autopart.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
           <p>© 2024 AutoPart Ecommerce. All rights reserved.</p>
           <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Cookie Settings</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
