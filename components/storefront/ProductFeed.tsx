import React from "react";
import { DUMMY_PRODUCTS } from "@/lib/dummy-data";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ProductFeed() {
  const featuredProducts = DUMMY_PRODUCTS.filter(p => p.isFeatured).slice(0, 8);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
             <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Trending Parts</h2>
             <p className="text-muted-foreground">Check out our most popular replacement parts, highly rated by professional mechanics and enthusiasts alike.</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
             View All Products <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, idx) => (
            <ProductCard key={product.sku || idx} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
           <Button variant="outline" className="w-full h-12">
             View All Products <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </div>
    </section>
  );
}
