"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Search, Loader2, User as UserIcon, Shield, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  phone?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: Column<User>[] = [
    {
      header: "User",
      accessorKey: "name",
      cell: (item) => (
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
               {item.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
               <span className="font-semibold text-gray-900">{item.name}</span>
               <span className="text-xs text-gray-500">{item.email}</span>
            </div>
         </div>
      )
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item) => (
         <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold w-fit",
            item.role === 'super_admin' ? "bg-purple-50 text-purple-700 border border-purple-100" :
            item.role === 'admin' ? "bg-blue-50 text-blue-700 border border-blue-100" :
            "bg-gray-50 text-gray-700 border border-gray-100"
         )}>
            <Shield className="w-3 h-3" />
            <span className="capitalize">{item.role.replace('_', ' ')}</span>
         </div>
      )
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (item) => (
         <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.createdAt).toLocaleDateString()}
         </div>
      )
    }
  ];

  const filteredUsers = users.filter(u => 
     u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer & Staff Directory</h1>
          <p className="text-gray-500">Manage all registered accounts and assign administrative roles.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search name or email..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <DataTable 
          data={filteredUsers} 
          isLoading={isLoading} 
          columns={columns}
          actions={(item) => (
             <>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                   <Shield className="w-4 h-4" />
                </button>
             </>
          )} 
        />
      </div>
    </AdminLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
