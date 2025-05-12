"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { suggestHiddenGems, type SuggestHiddenGemsOutput } from '@/ai/flows/hidden-gems-suggestions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Lightbulb, Building, Trees, Utensils, Sparkles, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { nepalDistricts, type DistrictName } from '@/types';
import Image from 'next/image';

const formSchema = z.object({
  districtName: z.custom<DistrictName>((val) => nepalDistricts.includes(val as DistrictName), {
    message: "Please select a valid district.",
  }),
  userPreferences: z.string().optional(),
});

export function DistrictExplorer() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | null>(null);
  const [hiddenGems, setHiddenGems] = useState<SuggestHiddenGemsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      districtName: undefined,
      userPreferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setHiddenGems(null);
    try {
      const result = await suggestHiddenGems({
        districtName: values.districtName,
        userPreferences: values.userPreferences,
      });
      setHiddenGems(result);
      toast({
        title: "Hidden Gems Found!",
        description: `Suggestions for ${values.districtName} generated.`,
      });
    } catch (e) {
      console.error(e);
      setError("Failed to fetch hidden gems. Please try again.");
      toast({
        title: "Error",
        description: "Could not fetch hidden gems.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDistrictChange = (district: DistrictName) => {
    setSelectedDistrict(district);
    setHiddenGems(null); // Reset gems when district changes
    form.setValue("districtName", district); // Sync with RHF
    // Here you could fetch initial district data if available
  };
  
  const districtImage = selectedDistrict ? `https://picsum.photos/seed/${selectedDistrict.replace(/\s+/g, '')}/800/400` : "https://picsum.photos/800/400";
  const districtImageHint = selectedDistrict ? `${selectedDistrict} landscape` : "Nepal landscape";


  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Explore Nepal's Districts</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover unique attractions, accommodations, and AI-powered local tips for each district.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select a District</CardTitle>
              <CardDescription>Choose a district to see its details and get hidden gem suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => handleDistrictChange(value as DistrictName)} value={selectedDistrict || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  {nepalDistricts.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedDistrict && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary h-6 w-6" /> AI Hidden Gems</CardTitle>
                <CardDescription>Get AI-powered suggestions for off-the-beaten-path locations in {selectedDistrict}.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="userPreferences">Your Preferences (Optional)</Label>
                    <Textarea
                      id="userPreferences"
                      placeholder="e.g., interested in nature, history, food..."
                      {...form.register("userPreferences")}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Searching..." : "Find Hidden Gems"}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedDistrict ? (
            <Card className="shadow-xl">
               <CardHeader className="p-0">
                <div className="aspect-video relative rounded-t-lg overflow-hidden">
                  <Image
                    src={districtImage}
                    alt={`Image of ${selectedDistrict}`}
                    data-ai-hint={districtImageHint}
                    fill
                    className="object-cover"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                     <h2 className="text-3xl font-bold text-white">{selectedDistrict}</h2>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {hiddenGems && hiddenGems.hiddenGems.length > 0 && (
                  <div className="space-y-3 p-4 border rounded-lg bg-primary/5">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" /> Hidden Gem Suggestions:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90">
                      {hiddenGems.hiddenGems.map((gem, index) => (
                        <li key={index}>{gem}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 {hiddenGems && hiddenGems.hiddenGems.length === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Specific Gems Found</AlertTitle>
                    <AlertDescription>AI couldn't find specific hidden gems based on the input. Try broadening your preferences or exploring general attractions.</AlertDescription>
                  </Alert>
                )}

                <Accordion type="single" collapsible className="w-full" defaultValue="attractions">
                  <AccordionItem value="attractions">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-secondary" /> Top Attractions</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Information about top attractions in {selectedDistrict} will be displayed here. (Content coming soon)</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Famous Landmark 1</li>
                        <li>Popular Viewpoint</li>
                        <li>Historical Site</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="accommodations">
                    <AccordionTrigger className="text-lg font-medium">
                     <div className="flex items-center gap-2"><Building className="h-5 w-5 text-secondary" /> Accommodations</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Details on luxury lodges, homestays, and budget options in {selectedDistrict}. (Content coming soon)</p>
                       <Button variant="link" className="p-0 h-auto text-base">View Booking Options</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="activities">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2"><Trees className="h-5 w-5 text-secondary" /> Activities & Events</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Discover tours, safaris, local festivals, and events happening in {selectedDistrict}. (Content coming soon)</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Trekking Route A</li>
                        <li>Local Festival (Date)</li>
                        <li>Cultural Tour</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="food">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center gap-2"><Utensils className="h-5 w-5 text-secondary" /> Local Cuisine</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Explore famous local dishes and best places to eat in {selectedDistrict}. (Content coming soon)</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30">
              <CardHeader>
                <Compass className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Select a District to Begin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Choose a district from the list to view its attractions and get AI-powered travel tips.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
