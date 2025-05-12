// src/components/home/SustainabilitySection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, Footprints, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SustainabilitySection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <Leaf className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Travel Sustainably in Nepal</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Make a positive impact while exploring. Learn about eco-friendly practices and responsible tourism.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Recycle className="h-8 w-8 text-accent mr-3" />
                <CardTitle className="text-2xl text-primary">Eco-Travel Score</CardTitle>
              </div>
              <CardDescription className="text-base">
                (Coming Soon) Calculate the carbon footprint of your choices and get greener alternatives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Make informed decisions about your environmental impact.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Footprints className="h-8 w-8 text-accent mr-3" />
                <CardTitle className="text-2xl text-primary">Responsible Tips</CardTitle>
              </div>
              <CardDescription className="text-base">
                Minimize impact, support locals, and respect Nepali culture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                <li>Respect local customs & dress modestly.</li>
                <li>Carry reusable water bottles.</li>
                <li>Support local businesses & artisans.</li>
                <li>Ask permission before taking photos.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-8 w-8 text-accent mr-3" />
                <CardTitle className="text-2xl text-primary">Support Regions</CardTitle>
              </div>
              <CardDescription className="text-base">
                (Coming Soon) Discover hidden gems in less-traveled areas to promote balanced tourism.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Explore beyond the usual trails.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/sustainability">
              Learn More About Sustainability
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
