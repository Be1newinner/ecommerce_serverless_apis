"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Building2, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/auth-context";

interface Company {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company>>({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: authUser } = useAuth();

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany.name) return toast.error("Name is required");

    try {
      setIsSubmitting(true);
      if (currentCompany._id) {
         // API doesn't support edit yet, so we just mock it for UI
         toast.success("Company updated successfully (Mock)");
      } else {
         await api.post("/companies", { name: currentCompany.name });
         toast.success("Company created successfully");
      }
      setIsModalOpen(false);
      setCurrentCompany({ name: "" });
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Company>[] = [
    { 
      header: "Name", 
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              {item.name.charAt(0).toUpperCase()}
           </div>
           <span className="font-semibold text-gray-900">{item.name}</span>
        </div>
      )
    },
    { 
      header: "Created At", 
      accessorKey: "createdAt",
      cell: (item) => new Date(item.createdAt).toLocaleDateString() 
    },
  ];

  const filteredCompanies = companies.filter(c => 
     c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Companies</h1>
            <p className="text-gray-500">Manage all registered companies in your system.</p>
          </div>
          {!authUser?.companyId && (
            <button 
              onClick={() => {
                setCurrentCompany({ name: "" });
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Company
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search companies..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
           </button>
        </div>

        {/* Data Table */}
        <DataTable 
          data={filteredCompanies} 
          columns={columns} 
          isLoading={isLoading}
          actions={(item) => (
             <>
                <button 
                  onClick={() => {
                    setCurrentCompany(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                   <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" />
                </button>
             </>
          )}
        />
      </div>

      {/* Corporate Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-gray-900">
                    {currentCompany._id ? "Edit Company" : "Add New Company"}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Company Name</label>
                    <input 
                       autoFocus
                       required
                       type="text" 
                       placeholder="Enter company name..." 
                       className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                       value={currentCompany.name}
                       onChange={(e) => setCurrentCompany({...currentCompany, name: e.target.value})}
                    />
                 </div>
                 <div className="pt-2 flex gap-3">
                    <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
                    >
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Utility icon
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
