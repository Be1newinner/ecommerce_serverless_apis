"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Search, Loader2, Star, MessageSquare, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  productId: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/admin/reviews");
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
       await api.delete(`/admin/reviews/${id}`);
       toast.success("Review deleted");
       fetchReviews();
    } catch (error) {
       toast.error("Delete failed");
    }
  };

  const columns: Column<Review>[] = [
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (item) => (
         <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
               <Star 
                  key={s} 
                  className={cn(
                     "w-3.5 h-3.5", 
                     s <= item.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"
                  )} 
               />
            ))}
         </div>
      )
    },
    {
      header: "User",
      accessorKey: "userName",
      cell: (item) => (
         <span className="font-semibold text-gray-900">{item.userName}</span>
      )
    },
    {
      header: "Content",
      accessorKey: "comment",
      cell: (item) => (
         <div className="flex flex-col max-w-sm">
            <span className="font-semibold text-gray-800 text-sm truncate">{item.title}</span>
            <span className="text-xs text-gray-500 line-clamp-1">{item.comment}</span>
         </div>
      )
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item) => (
         <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {new Date(item.createdAt).toLocaleDateString()}
         </div>
      )
    }
  ];

  const filteredReviews = reviews.filter(r => 
     r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Reviews</h1>
          <p className="text-gray-500">Monitor and moderate customer feedback across your catalog.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search reviews..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <DataTable 
          data={filteredReviews} 
          isLoading={isLoading} 
          columns={columns}
          actions={(item) => (
             <>
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
    </AdminLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
