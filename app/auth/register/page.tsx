"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  PartyPopper,
  Building2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    domain: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        domain: formData.domain,
        password: formData.password,
      });

      toast.success("Account created successfully!");
      // After registration with company creation, take directly to admin
      window.location.href = "/admin";
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans selection:bg-primary/20 selection:text-primary">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join our premium partner network
            </p>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden backdrop-blur-3xl bg-background/80">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              Get Started
              <PartyPopper className="h-4 w-4 text-primary animate-bounce" />
            </CardTitle>
            <CardDescription>
              Create your account and organization in one step
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-bold ml-1 text-foreground/80"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-bold ml-1 text-foreground/80"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-bold ml-1 text-foreground/80"
                  htmlFor="companyName"
                >
                  Company Name
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="companyName"
                    type="text"
                    required
                    placeholder="Acme Corp"
                    className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-bold ml-1 text-foreground/80"
                  htmlFor="domain"
                >
                  Business Domain (Optional)
                </label>
                <div className="relative group">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="domain"
                    type="text"
                    placeholder="acme.com"
                    className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-bold ml-1 text-foreground/80"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl text-xs"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-bold ml-1 text-foreground/80"
                    htmlFor="confirmPassword"
                  >
                    Confirm
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl text-xs"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-muted/30 p-6">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Sign in instead
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
