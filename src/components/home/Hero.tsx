import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
          Explore the Majestic Beauty of Nepal
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Journey through breathtaking landscapes, ancient cultures, and thrilling adventures. Your unforgettable Himalayan experience starts here.
        </p>
        <Button asChild size="lg" className="mt-10 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg px-10 py-6 text-lg">
          <Link href="/plan-trip">
            Plan Your Adventure
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      
      <div className="container mt-16 md:mt-24">
        <div className="relative aspect-[16/7] bg-muted/50 rounded-xl shadow-2xl overflow-hidden group p-8 flex flex-col items-center justify-center text-center border">
           <Globe className="h-16 w-16 text-primary mb-6 opacity-50" />
           <h2 className="text-3xl md:text-4xl font-bold text-primary">Interactive 3D Map of Nepal</h2>
           <p className="mt-3 text-muted-foreground max-w-xl">
            (Coming Soon) Immerse yourself in an interactive 3D replica of Nepal's geography and landmarks. Explore mountains, rivers, and cultural sites like never before.
           </p>
           {/* Placeholder for Three.js canvas or interactive map component */}
            <div className="mt-4 text-sm text-muted-foreground/70">
                This will be replaced by a WebGL/Three.js powered map.
            </div>
             <Image
              src="https://picsum.photos/seed/nepalmap/1200/400" // Placeholder image for the map area
              alt="Stylized map of Nepal"
              data-ai-hint="Nepal map abstract"
              fill
              className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 -z-10"
              priority
            />
        </div>
      </div>
    </section>
  );
}
