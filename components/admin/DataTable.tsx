"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T>({ 
  data, 
  columns, 
  isLoading, 
  onRowClick,
  actions 
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              {columns.map((column, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  ))}
                  {actions && <td className="px-6 py-4"></td>}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, idx) => (
                <tr 
                  key={idx} 
                  className={cn(
                    "hover:bg-gray-50/80 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {column.cell ? column.cell(item) : (item[column.accessorKey as keyof T] as any)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Mock */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{data.length}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-50" disabled>
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-50" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-md text-sm border border-blue-100">
             1
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-50" disabled>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-50" disabled>
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
