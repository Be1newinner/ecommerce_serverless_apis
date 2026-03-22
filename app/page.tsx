import Navbar from "@/components/storefront/Navbar";
import Hero from "@/components/storefront/Hero";
import ProductFeed from "@/components/storefront/ProductFeed";
import Footer from "@/components/storefront/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
        <section className="py-12 border-y bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Truck, 
                  title: "Free Express Shipping", 
                  desc: "On all orders above ₹1,999. Delivered to your doorstep." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Genuine Parts Only", 
                  desc: "100% authentic components with manufacturer warranty." 
                },
                { 
                  icon: Clock, 
                  title: "Expert Support 24/7", 
                  desc: "Our mechanics are ready to help you find the right fit." 
                }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProductFeed />

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
           <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl">
                 <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">Built for Performance. <br />Trusted by Professionals.</h2>
                 <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl">
                   Join over 50,000+ satisfied customers who trust AutoPart for their vehicle maintenance and performance upgrades.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" size="lg" className="h-12 px-8">
                       Create an Account
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 border-primary-foreground hover:bg-white/10 hover:text-white">
                       Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
