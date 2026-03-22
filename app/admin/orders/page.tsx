"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Search, Loader2, Eye, Truck, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
       await api.put(`/admin/orders/${id}/status`, { status });
       toast.success("Order status updated");
       fetchOrders();
    } catch (error) {
       toast.error("Status update failed");
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "Order #",
      accessorKey: "orderNumber",
      cell: (item) => <span className="font-mono font-bold text-gray-900">{item.orderNumber}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => {
         const config = {
            pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-100", icon: Clock },
            processing: { color: "bg-blue-50 text-blue-700 border-blue-100", icon: Loader2 },
            shipped: { color: "bg-purple-50 text-purple-700 border-purple-100", icon: Truck },
            delivered: { color: "bg-green-50 text-green-700 border-green-100", icon: CheckCircle },
            cancelled: { color: "bg-red-50 text-red-700 border-red-100", icon: XIcon }
         };
         const { color, icon: Icon } = config[item.status] || config.pending;
         return (
            <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border", color)}>
               <Icon className={cn("w-3 h-3", item.status === 'processing' && "animate-spin")} />
               <span className="capitalize">{item.status}</span>
            </div>
         );
      }
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (item) => <span className="font-semibold text-gray-900">₹{item.total.toLocaleString()}</span>
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item) => new Date(item.createdAt).toLocaleDateString()
    }
  ];

  const filteredOrders = orders.filter(o => 
     o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
          <p className="text-gray-500">View and update customer orders and fulfillment status.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search Order Number..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <DataTable 
          data={filteredOrders} 
          isLoading={isLoading} 
          columns={columns}
          actions={(item) => (
             <>
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                   <Eye className="w-4 h-4" />
                </button>
             </>
          )} 
        />
      </div>
    </AdminLayout>
  );
}

function XIcon({ className }: { className?: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
         <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
   );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
