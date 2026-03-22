"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Search, Filter, Loader2, X, Package, Tag, ArrowUpDown } from "lucide-react";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  category: string;
  isFeatured: boolean;
  images: string[];
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: 0,
    inventory: 0,
    category: "",
    isFeatured: false,
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/products");
      // Res structure for products is usually { products, total, ... } based on typical next.js ecommerce patterns
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (currentProduct._id) {
         await api.put(`/products/${currentProduct._id}`, currentProduct);
         toast.success("Product updated successfully");
      } else {
         await api.post("/products", currentProduct);
         toast.success("Product created successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const columns: Column<Product>[] = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
             {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <Package className="w-6 h-6" />
                </div>
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-900 truncate">{item.name}</span>
            <span className="text-xs text-gray-400 font-mono uppercase">{item.sku}</span>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item) => (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md text-gray-600 text-xs font-medium w-fit">
           <Tag className="w-3 h-3 text-gray-400" />
           {item.category}
        </div>
      )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item) => <span className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</span>
    },
    {
      header: "Stock",
      accessorKey: "inventory",
      cell: (item) => (
         <div className="flex items-center gap-2">
            <div className={cn(
               "w-2 h-2 rounded-full",
               item.inventory > 10 ? "bg-green-500" : item.inventory > 0 ? "bg-yellow-500" : "bg-red-500"
            )}></div>
            <span className="text-gray-600">{item.inventory} units</span>
         </div>
      )
    }
  ];

  const filteredProducts = products.filter(p => 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-gray-500">Manage your product catalog, inventory, and pricing.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentProduct({ name: "", sku: "", price: 0, inventory: 0, category: "", isFeatured: false, images: [] });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search name or SKU..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                 <Filter className="w-4 h-4 inline mr-2" />
                 Category
              </button>
           </div>
        </div>

        <DataTable 
          data={filteredProducts} 
          columns={columns} 
          isLoading={isLoading}
          actions={(item) => (
             <>
                <button 
                  onClick={() => {
                    setCurrentProduct(item);
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
           <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    {currentProduct._id ? "Edit Product" : "Add New Product"}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Product Name</label>
                       <input 
                          required
                          type="text" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={currentProduct.name}
                          onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">SKU</label>
                       <input 
                          required
                          type="text" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={currentProduct.sku}
                          onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Category</label>
                       <input 
                          required
                          type="text" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={currentProduct.category}
                          onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Price (INR)</label>
                       <input 
                          required
                          type="number" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={currentProduct.price}
                          onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-semibold text-gray-700">Inventory Stock</label>
                       <input 
                          required
                          type="number" 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={currentProduct.inventory}
                          onChange={(e) => setCurrentProduct({...currentProduct, inventory: Number(e.target.value)})}
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-2 pt-2">
                    <input 
                       type="checkbox" 
                       id="isFeatured"
                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                       checked={currentProduct.isFeatured}
                       onChange={(e) => setCurrentProduct({...currentProduct, isFeatured: e.target.checked})}
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 underline underline-offset-4 decoration-blue-100">Featured on Home Page</label>
                 </div>
              </form>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                 <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                 >
                    Discard
                 </button>
                 <button 
                    onClick={handleCreateOrUpdate}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-md"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Product"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
