// src/app/sustainability/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, Footprints, TrendingUp } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <Leaf className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">Travel Sustainably in Nepal</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how you can make a positive impact while exploring the beauty of Nepal. Learn about our eco-friendly initiatives and responsible tourism practices.
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
              (Coming Soon) Calculate the carbon footprint of your travel choices and get suggestions for greener alternatives, like choosing local transport over flights for shorter distances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We are developing a tool to help you make more informed decisions about your environmental impact.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
             <div className="flex items-center mb-2">
              <Footprints className="h-8 w-8 text-accent mr-3" />
              <CardTitle className="text-2xl text-primary">Responsible Tourism Tips</CardTitle>
            </div>
            <CardDescription className="text-base">
              Learn how to minimize your impact, support local communities, and respect Nepali culture and traditions during your travels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Respect local customs and dress modestly.</li>
              <li>Avoid single-use plastics; carry a reusable water bottle.</li>
              <li>Support local businesses and artisans.</li>
              <li>Do not disturb wildlife or damage natural habitats.</li>
              <li>Ask for permission before taking photographs of people.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
             <div className="flex items-center mb-2">
              <TrendingUp className="h-8 w-8 text-accent mr-3" />
              <CardTitle className="text-2xl text-primary">Supporting Under-Visited Regions</CardTitle>
            </div>
            <CardDescription className="text-base">
              (Coming Soon) Discover hidden gems in less-traveled areas. Our platform will highlight these regions to promote balanced tourism and economic benefits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We aim to showcase the beauty of all 77 districts, encouraging exploration beyond the usual tourist trails.</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-16 text-center p-8 bg-muted/50 rounded-lg border">
          <h2 className="text-2xl font-semibold text-primary">Our Commitment</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
            Visit Nepal is committed to promoting sustainable and responsible tourism that benefits local communities and preserves the natural and cultural heritage of Nepal for future generations.
          </p>
        </div>
    </div>
  );
}
