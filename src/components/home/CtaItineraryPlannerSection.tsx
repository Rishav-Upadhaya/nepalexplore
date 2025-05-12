// src/components/home/CtaItineraryPlannerSection.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, Sparkles, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CtaItineraryPlannerSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <Card className="max-w-4xl mx-auto shadow-xl overflow-hidden border-2 border-primary/30">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10 bg-primary/5">
                <div className="flex items-center text-primary mb-4">
                    <Sparkles className="h-10 w-10 mr-3" />
                    <CardTitle className="text-3xl md:text-4xl font-bold">Craft Your Perfect Nepal Itinerary</CardTitle>
                </div>
              <CardDescription className="text-lg text-muted-foreground mb-6">
                Let our AI guide you in planning an unforgettable journey tailored to your preferences. Just a few clicks to your dream Nepal adventure!
              </CardDescription>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta-start-date" className="text-base font-medium">Start Date</Label>
                    <Input type="date" id="cta-start-date" className="mt-1 h-11 text-base" placeholder="Pick a date" />
                  </div>
                  <div>
                    <Label htmlFor="cta-end-date" className="text-base font-medium">End Date</Label>
                    <Input type="date" id="cta-end-date" className="mt-1 h-11 text-base" placeholder="Pick a date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cta-interests" className="text-base font-medium">Interests</Label>
                  <Input id="cta-interests" className="mt-1 h-11 text-base" placeholder="e.g., Trekking, Culture, Wildlife" />
                </div>
                <Button type="button" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3.5" asChild>
                   <Link href="/plan-trip">
                     Plan My Trip Now
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
                </Button>
              </form>
            </div>
            <div className="hidden md:block relative">
               {/* Using a simple background color for the image side as in the mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-8">
                  <CalendarDays className="h-32 w-32 text-primary opacity-20"/>
              </div>
              {/* You could also use an Image component here if you have a suitable background image */}
              {/* 
              <Image 
                src="https://picsum.photos/seed/nepalplanner/600/800" 
                alt="Planning a trip to Nepal"
                data-ai-hint="Nepal planning travel"
                fill
                className="object-cover"
              /> 
              */}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
