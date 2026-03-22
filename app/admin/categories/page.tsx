"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Search, Filter, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({ 
    name: "", 
    description: "", 
    isActive: true 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name) return toast.error("Name is required");

    try {
      setIsSubmitting(true);
      if (currentCategory._id) {
         // Assuming PUT /api/categories/[id] exists
         await api.put(`/categories/${currentCategory._id}`, currentCategory);
         toast.success("Category updated successfully");
      } else {
         await api.post("/categories", currentCategory);
         toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete");
    }
  };

  const columns: Column<Category>[] = [
    { 
      header: "Category", 
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
           {item.image ? (
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
           ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                 <TagIcon className="w-5 h-5" />
              </div>
           )}
           <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{item.name}</span>
              <span className="text-xs text-gray-500">/{item.slug}</span>
           </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "isActive",
      cell: (item) => (
         <span className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold",
            item.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
         )}>
            {item.isActive ? "Active" : "Inactive"}
         </span>
      )
    },
    { 
      header: "Created", 
      accessorKey: "createdAt",
      cell: (item) => new Date(item.createdAt).toLocaleDateString() 
    },
  ];

  const filteredCategories = categories.filter(c => 
     c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
            <p className="text-gray-500">Manage product categories and hierarchy.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentCategory({ name: "", description: "", isActive: true });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search categories..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <DataTable 
          data={filteredCategories} 
          columns={columns} 
          isLoading={isLoading}
          actions={(item) => (
             <>
                <button 
                  onClick={() => {
                    setCurrentCategory(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                   <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                   <Trash2 className="w-4 h-4" />
                </button>
             </>
          )}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-gray-900">
                    {currentCategory._id ? "Edit Category" : "Add New Category"}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Category Name</label>
                       <input 
                          autoFocus
                          required
                          type="text" 
                          placeholder="e.g. Engine Parts" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                          value={currentCategory.name}
                          onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Description</label>
                       <textarea 
                          rows={3}
                          placeholder="Brief description of the category..." 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                          value={currentCategory.description}
                          onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                       />
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                          type="checkbox" 
                          id="isActive"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={currentCategory.isActive}
                          onChange={(e) => setCurrentCategory({...currentCategory, isActive: e.target.checked})}
                       />
                       <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active Category</label>
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
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
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Category"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}

function TagIcon({ className }: { className?: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
         <path d="m15 5 6 6-6 6"/><path d="M21 11H3"/><path d="M9 19l-6-6 6-6"/>
      </svg>
   );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
