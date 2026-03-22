import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Card className="group overflow-hidden border-none bg-background transition-all hover:translate-y-[-4px]">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground italic">No image</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/20">
           <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
              <Eye className="h-4 w-4" />
           </Button>
           <Button size="icon" className="rounded-full shadow-lg">
              <ShoppingCart className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">{product.manufacturer}</p>
          <Link href={`/products/${product.sku}`}>
            <h3 className="font-semibold tracking-tight hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
             <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
             <span className="text-xs font-semibold">{product.rating || 4.5}</span>
             <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
           <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
           {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
           )}
        </div>
      </CardFooter>
    </Card>
  );
}
