import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Palette, MountainSnow, PawPrint } from 'lucide-react'; // Updated icons for better representation

const categories = [
  {
    title: "Rich Culture & Heritage",
    icon: Palette,
    description: "Discover ancient temples, vibrant festivals, and the warm hospitality of the Nepali people. Explore UNESCO World Heritage sites in Kathmandu Valley.",
    image: "https://picsum.photos/seed/culture_nepal/600/400",
    hint: "Nepal temple festival",
  },
  {
    title: "Thrilling Adventures",
    icon: MountainSnow,
    description: "Embark on world-class treks like Everest Base Camp and Annapurna Circuit, or try rafting, paragliding, and bungee jumping amidst stunning landscapes.",
    image: "https://picsum.photos/seed/adventure_nepal/600/400",
    hint: "Nepal trekking mountain",
  },
  {
    title: "Diverse Wildlife",
    icon: PawPrint, // Using PawPrint for wildlife
    description: "Explore national parks teeming with rare species like the Bengal tiger, one-horned rhinoceros, and elusive snow leopard. A paradise for nature lovers.",
    image: "https://picsum.photos/seed/wildlife_nepal/600/400",
    hint: "Nepal rhino tiger",
  }
];

export function WhyNepal() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Why Nepal?</h2>
          {/* Optional subtitle if needed: 
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            A land of breathtaking beauty, spiritual serenity, and unparalleled adventure.
          </p> 
          */}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full">
                  <Image
                    src={category.image}
                    alt={category.title}
                    data-ai-hint={category.hint}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-3">
                  <category.icon className="h-8 w-8 text-accent mr-3" />
                  <CardTitle className="text-xl text-primary">{category.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground text-base">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
