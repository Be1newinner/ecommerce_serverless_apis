"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Search, Loader2, X, Image as ImageIcon, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({
    title: "",
    image: "",
    isActive: true,
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/banners");
      setBanners(res.data.banners || []);
    } catch (error) {
      console.error("Fetch banners error:", error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (currentBanner._id) {
         await api.put(`/admin/banners/${currentBanner._id}`, currentBanner);
         toast.success("Banner updated");
      } else {
         await api.post("/admin/banners", currentBanner);
         toast.success("Banner created");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Banner>[] = [
    {
      header: "Banner",
      accessorKey: "image",
      cell: (item) => (
         <div className="flex items-center gap-4">
            <div className="w-24 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
               {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                     <ImageIcon className="w-6 h-6" />
                  </div>
               )}
            </div>
            <div className="flex flex-col">
               <span className="font-semibold text-gray-900">{item.title}</span>
               <span className="text-xs text-gray-400">Order: {item.order}</span>
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
            {item.isActive ? "Active" : "Disabled"}
         </span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Home Banners</h1>
            <p className="text-gray-500">Manage promotional banners on the storefront.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentBanner({ title: "", image: "", isActive: true, order: 0 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        <DataTable 
          data={banners} 
          isLoading={isLoading} 
          columns={columns} 
          actions={(item) => (
             <>
                <button 
                  onClick={() => {
                     setCurrentBanner(item);
                     setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                   <Edit2 className="w-4 h-4" />
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
                    {currentBanner._id ? "Edit Banner" : "New Promotional Banner"}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Display Title</label>
                    <input 
                       required
                       type="text" 
                       className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                       value={currentBanner.title}
                       onChange={(e) => setCurrentBanner({...currentBanner, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Image URL</label>
                    <input 
                       required
                       type="text" 
                       placeholder="https://content.com/image.jpg"
                       className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                       value={currentBanner.image}
                       onChange={(e) => setCurrentBanner({...currentBanner, image: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Display Order</label>
                       <input 
                          type="number" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          value={currentBanner.order}
                          onChange={(e) => setCurrentBanner({...currentBanner, order: Number(e.target.value)})}
                       />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                       <input 
                          type="checkbox" 
                          id="activeCheck"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={currentBanner.isActive}
                          onChange={(e) => setCurrentBanner({...currentBanner, isActive: e.target.checked})}
                       />
                       <label htmlFor="activeCheck" className="text-sm font-medium text-gray-700">Is Active</label>
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
                       className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center shadow-sm"
                    >
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Banner"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
