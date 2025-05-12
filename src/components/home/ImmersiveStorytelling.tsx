import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

const stories = [
  {
    title: "Dashain & Tihar Festivals",
    description: "Experience the vibrant colors and joyous celebrations of Nepal's biggest festivals.",
    image: "https://picsum.photos/seed/festival/600/400",
    hint: "Nepal festival",
    link: "#", // Placeholder link
  },
  {
    title: "Sunrise from Sarangkot",
    description: "Witness a breathtaking panoramic sunrise over the Annapurna mountain range.",
    image: "https://picsum.photos/seed/sarangkot/600/400",
    hint: "Sarangkot sunrise",
    link: "#", // Placeholder link
  },
  {
    title: "Biodiversity Hotspot",
    description: "Discover Nepal's rich flora and fauna, from elusive snow leopards to diverse birdlife.",
    image: "https://picsum.photos/seed/biodiversity/600/400",
    hint: "Nepal wildlife",
    link: "#", // Placeholder link
  },
];

export function ImmersiveStorytelling() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Immersive Stories of Nepal</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive deeper into the heart of Nepal with captivating visuals and narratives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardHeader className="p-0 relative">
                <div className="aspect-[3/2] w-full relative">
                  <Image
                    src={story.image}
                    alt={story.title}
                    data-ai-hint={story.hint}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="h-16 w-16 text-white/80" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                <CardDescription className="mb-4 text-muted-foreground h-16 overflow-hidden">
                  {story.description}
                </CardDescription>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href={story.link}>
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
            <p className="text-muted-foreground">Interactive 360° videos and 3D photo spheres coming soon!</p>
        </div>
      </div>
    </section>
  );
}
