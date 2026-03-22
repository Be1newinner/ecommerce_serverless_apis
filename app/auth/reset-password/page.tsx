"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mocking the reset request for now as per simple implementation
      // await api.post("/auth/forgot-password", { email });
      setTimeout(() => {
        setSuccess(true);
        toast.success("Reset instructions sent to your email!");
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      toast.error("Failed to send reset email. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans">
        <Card className="w-full max-w-md border-border/50 shadow-2xl rounded-3xl overflow-hidden text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Check your email</CardTitle>
          <CardDescription className="text-base mb-8">
            We've sent password reset instructions to <br /><span className="font-bold text-foreground">{email}</span>
          </CardDescription>
          <Button asChild className="w-full rounded-xl h-11">
            <Link href="/login">Return to Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden backdrop-blur-3xl bg-background/80">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
               <KeyRound className="h-5 w-5 text-primary" />
               Reset Password
            </CardTitle>
            <CardDescription>
              We'll send you instructions to reset your password
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
                    required
                    placeholder="name@company.com"
                    className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-background transition-all rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/30 p-6">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
