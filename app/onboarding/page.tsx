"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, ArrowRight, Loader2, Sparkles, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingCompanies, setFetchingCompanies] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [mode, setMode] = useState<"select" | "create">("select");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/auth/onboarding");
        setCompanies(res.data.companies || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setFetchingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Redirect if company already set
  useEffect(() => {
    if (user?.companyId) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = mode === "select" 
        ? { companyId: selectedCompanyId }
        : { companyName: newCompanyName };
      
      const res = await api.post("/auth/onboarding", payload);
      toast.success(res.data.message || "Welcome aboard!");
      
      // Update local state and redirect
      router.push("/admin");
      setTimeout(() => window.location.reload(), 100);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans selection:bg-primary/20 selection:text-primary">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-8 gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organization Setup</h1>
            <p className="text-muted-foreground mt-1">Hello, {user?.name}. Please select or create your organization.</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl bg-background/80">
          <CardHeader className="space-y-1 pb-6 border-b bg-muted/20">
            <div className="flex items-center justify-between">
               <CardTitle className="text-xl flex items-center gap-2">
                  Setup Organization
                  <Sparkles className="h-4 w-4 text-primary" />
               </CardTitle>
               <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cancel
               </Button>
            </div>
            <CardDescription>
              Every user must be associated with an organization to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex gap-4 mb-8 p-1.5 bg-muted/50 rounded-2xl">
               <button 
                  onClick={() => setMode("select")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === "select" ? "bg-background shadow-sm text-primary scale-100" : "text-muted-foreground hover:text-foreground hover:bg-muted scale-95"}`}
               >
                  <Building2 className="h-4 w-4" />
                  Select Existing
               </button>
               <button 
                  onClick={() => setMode("create")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === "create" ? "bg-background shadow-sm text-primary scale-100" : "text-muted-foreground hover:text-foreground hover:bg-muted scale-95"}`}
               >
                  <Plus className="h-4 w-4" />
                  Create New
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "select" ? (
                <div className="space-y-4">
                  <label className="text-sm font-bold ml-1 text-foreground/80">
                    Existing Organizations
                  </label>
                  {fetchingCompanies ? (
                     <div className="flex items-center justify-center py-10 opacity-50">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span className="font-bold text-sm">Fetching list...</span>
                     </div>
                  ) : companies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {companies.map((company) => (
                        <button
                          key={company._id}
                          type="button"
                          onClick={() => setSelectedCompanyId(company._id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group ${
                            selectedCompanyId === company._id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                             <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selectedCompanyId === company._id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"}`}>
                                <Building2 className="h-5 w-5" />
                             </div>
                             <span className="font-bold tracking-tight">{company.name}</span>
                          </div>
                          {selectedCompanyId === company._id && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
                       <p className="text-sm text-muted-foreground italic mb-3">No organizations found</p>
                       <Button variant="outline" size="sm" onClick={() => setMode("create")}>Create the first one</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-bold ml-1 text-foreground/80" htmlFor="companyName">
                    New Organization Name
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="companyName"
                      type="text"
                      required
                      placeholder="e.g. Acme Corporation"
                      className="h-14 pl-12 rounded-2xl bg-muted/20 border-border print:50 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1 uppercase font-bold tracking-wider opacity-60">
                     Setup your workspace. You can invite team members later.
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all relative overflow-hidden group/btn"
                disabled={loading || (mode === "select" && !selectedCompanyId) || (mode === "create" && !newCompanyName)}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Complete Setup
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-muted/20 p-6">
            <p className="text-xs text-muted-foreground text-center line-clamp-2">
               Your organization ID will be used to segregate your data and provide a secure, isolated environment for your storefront and admin tools.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
