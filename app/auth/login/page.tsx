"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (!user.companyId) {
        router.push("/onboarding");
      } else {
        router.push("/admin");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message || "Logged in successfully!");
      
      const loggedInUser = res.data.user;
      if (!loggedInUser.companyId) {
        router.push("/onboarding");
      } else {
        router.push("/admin");
      }
      
      // Force refresh of auth state
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans selection:bg-primary/20 selection:text-primary">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your admin dashboard</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden backdrop-blur-3xl bg-background/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
               Sign In
               <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-foreground/80" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-foreground/80" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
           &copy; 2026 AutoPart Enterprise System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
