"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-12 md:pt-32 md:pb-24">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20 pointer-events-none">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/30" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 blur-3xl opacity-20 pointer-events-none">
        <div className="h-[400px] w-[400px] rounded-full bg-blue-500/20" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-semibold hover:bg-muted transition-colors cursor-default mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Spring Sale: Up to 40% Off Select Parts
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
        >
          Premium Auto Parts for <br className="hidden md:block" /> Every Vehicle
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg text-muted-foreground mb-10 md:text-xl"
        >
          Engineered for performance. Built for durability. Find the exact parts you need with our AI-powered search and expert catalog.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="h-12 px-8 text-base">
            Shop Catalog <ShoppingBag className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base">
            Track Order <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Feature Grid / Social Proof */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
           <div className="flex items-center gap-2 font-bold text-xl">Bosch</div>
           <div className="flex items-center gap-2 font-bold text-xl">Brembo</div>
           <div className="flex items-center gap-2 font-bold text-xl">Castrol</div>
           <div className="flex items-center gap-2 font-bold text-xl">NGK</div>
        </motion.div>
      </div>
    </section>
  );
}
