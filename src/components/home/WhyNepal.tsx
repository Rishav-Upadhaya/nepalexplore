import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, MountainSnowIcon, LeafIcon } from 'lucide-react'; // Using MountainSnowIcon for clarity as MountainSnow is used elsewhere

const categories = [
  {
    value: "culture",
    title: "Vibrant Culture",
    icon: Palette,
    description: "Immerse yourself in ancient traditions, colorful festivals, and sacred sites.",
    items: [
      { name: "Kathmandu Durbar Square", image: "https://picsum.photos/seed/culture1/400/300", hint: "Kathmandu temple" },
      { name: "Pashupatinath Temple", image: "https://picsum.photos/seed/culture2/400/300", hint: "Hindu temple" },
      { name: "Boudhanath Stupa", image: "https://picsum.photos/seed/culture3/400/300", hint: "Buddhist stupa" },
    ]
  },
  {
    value: "adventure",
    title: "Thrilling Adventures",
    icon: MountainSnowIcon,
    description: "Conquer majestic peaks, raft wild rivers, and paraglide over stunning valleys.",
    items: [
      { name: "Everest Base Camp Trek", image: "https://picsum.photos/seed/adventure1/400/300", hint: "Everest mountain" },
      { name: "Rafting in Trishuli River", image: "https://picsum.photos/seed/adventure2/400/300", hint: "river rafting" },
      { name: "Paragliding in Pokhara", image: "https://picsum.photos/seed/adventure3/400/300", hint: "paragliding Pokhara" },
    ]
  },
  {
    value: "wildlife",
    title: "Rich Wildlife",
    icon: LeafIcon,
    description: "Encounter rare species like one-horned rhinos and Bengal tigers in lush national parks.",
    items: [
      { name: "Chitwan National Park", image: "https://picsum.photos/seed/wildlife1/400/300", hint: "rhino wildlife" },
      { name: "Bardia National Park", image: "https://picsum.photos/seed/wildlife2/400/300", hint: "tiger jungle" },
      { name: "Red Panda Spotting", image: "https://picsum.photos/seed/wildlife3/400/300", hint: "red panda" },
    ]
  }
];

export function WhyNepal() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Nepal?</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            A land of breathtaking beauty, spiritual serenity, and unparalleled adventure.
          </p>
        </div>

        <Tabs defaultValue="culture" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category.value} value={category.value} className="py-2.5 text-base sm:text-sm">
                <category.icon className="mr-2 h-5 w-5" /> {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.value} value={category.value}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold">{category.title}</h3>
                <p className="mt-2 text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map(item => (
                  <Card key={item.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-0">
                       <div className="aspect-video relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          data-ai-hint={item.hint}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
