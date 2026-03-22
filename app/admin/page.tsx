"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users,
  ShoppingCart,
  Package,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATS = [
  {
    label: "Total Sales",
    value: "₹1,24,500",
    icon: TrendingUp,
    trend: "+12.5%",
    trendType: "up",
  },
  {
    label: "Total Orders",
    value: "456",
    icon: ShoppingCart,
    trend: "+8.2%",
    trendType: "up",
  },
  {
    label: "Total Products",
    value: "1,234",
    icon: Package,
    trend: "-2.4%",
    trendType: "down",
  },
  {
    label: "Total Companies",
    value: "12",
    icon: Building2,
    trend: "+4.1%",
    trendType: "up",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <Button className="shrink-0 rounded-xl h-11 px-6">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                      stat.trendType === "up"
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-red-50",
                    )}
                  >
                    {stat.trendType === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity / Charts Mock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm bg-background min-h-[450px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <CardTitle className="text-xl font-bold">
                Revenue Analytics
              </CardTitle>
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[11px] font-bold bg-background shadow-sm rounded-lg px-3 uppercase tracking-wider"
                >
                  Weekly
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[11px] font-bold text-muted-foreground rounded-lg px-3 uppercase tracking-wider"
                >
                  Monthly
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px]">
              <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-muted/50 rounded-2xl bg-muted/10">
                <p className="text-muted-foreground text-sm font-medium">
                  Interactive analytics chart will be rendered here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <CardTitle className="text-xl font-bold">
                Recent Activity
              </CardTitle>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary font-bold"
              >
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-7">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start pb-6 border-b border-muted/30 last:border-none last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-tight">
                        <span className="font-bold">Rahul Verma</span> placed an
                        order{" "}
                        <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                          ORD-98721
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
