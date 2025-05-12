import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Discover <span className="text-primary">Nepal</span>
              <br />
              Your Adventure Awaits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Embark on an unforgettable journey through the Himalayas, ancient temples, and vibrant cultures with Nepal Explorer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow">
                <Link href="/plan-trip">
                  Plan Your Trip
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="shadow-lg hover:shadow-secondary/50 transition-shadow">
                <Link href="/districts">
                  Explore Districts
                  <Map className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden group">
            <Image
              src="https://picsum.photos/1200/675"
              alt="Panoramic view of the Himalayas"
              data-ai-hint="Nepal Himalayas"
              width={1200}
              height={675}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-semibold text-primary-foreground">Interactive 3D Map</h3>
              <p className="text-sm text-primary-foreground/80">Explore Nepal's terrain in stunning detail. (Coming Soon!)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
