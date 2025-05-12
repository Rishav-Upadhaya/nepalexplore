"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Loader2, MapPin, Lightbulb, Building, Trees, Utensils, Sparkles, Info, Compass, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { nepalDistricts, type DistrictName } from '@/types';
import Image from 'next/image';

const formSchema = z.object({
  districtName: z.custom<DistrictName>((val) => nepalDistricts.includes(val as DistrictName), {
    message: "Please select a valid district.",
  }),
  userPreferences: z.string().optional(),
});

// Placeholder data for district details - replace with actual data fetching
const getDistrictDetails = (districtName: DistrictName | null) => {
  if (!districtName) return null;
  // In a real app, this would fetch data based on districtName
  return {
    name: districtName,
    tagline: `Discover the unique charm and attractions of ${districtName}. More details coming soon!`,
    attractions: ["Famous Landmark 1 (Placeholder)", "Popular Viewpoint (Placeholder)", "Historical Site (Placeholder)"],
    accommodations: ["Luxury Lodges (Placeholder)", "Homestays (Placeholder)", "Budget Options (Placeholder)"],
    activities: ["Trekking Route A (Placeholder)", "Local Festival (Date) (Placeholder)", "Cultural Tour (Placeholder)"],
    food: ["Famous Local Dish 1 (Placeholder)", "Best Restaurant (Placeholder)"]
  };
};


export function DistrictExplorer() {
  const searchParams = useSearchParams();
  const initialDistrictFromUrl = searchParams.get('name') as DistrictName | null;
  
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | null>(initialDistrictFromUrl);
  const [districtDetails, setDistrictDetails] = useState<ReturnType<typeof getDistrictDetails> | null>(null);
  const [hiddenGems, setHiddenGems] = useState<SuggestHiddenGemsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGems, setIsLoadingGems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      districtName: initialDistrictFromUrl || undefined,
      userPreferences: "",
    },
  });
  
  useEffect(() => {
    if (initialDistrictFromUrl && nepalDistricts.includes(initialDistrictFromUrl)) {
      handleDistrictChange(initialDistrictFromUrl, false); // don't reset gems if coming from URL
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDistrictFromUrl]);
  
  useEffect(() => {
    if (selectedDistrict) {
      // Simulate fetching district details
      setIsLoading(true);
      setDistrictDetails(null); // Clear previous details
      setTimeout(() => { // Replace with actual API call
        setDistrictDetails(getDistrictDetails(selectedDistrict));
        setIsLoading(false);
      }, 500);
      form.setValue("districtName", selectedDistrict);
    } else {
      setDistrictDetails(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict]);


  async function onSuggestGemsSubmit(values: z.infer<typeof formSchema>) {
    setIsLoadingGems(true);
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
        description: `AI suggestions for ${values.districtName} generated.`,
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
      setIsLoadingGems(false);
    }
  }

  const handleDistrictChange = (district: DistrictName, resetGems = true) => {
    setSelectedDistrict(district);
    if (resetGems) {
      setHiddenGems(null); 
    }
    form.setValue("districtName", district);
    // Update URL without full page reload
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('name', district);
    window.history.pushState({}, '', `${window.location.pathname}?${currentParams.toString()}`);
  };
  
  const districtImage = selectedDistrict ? `https://picsum.photos/seed/${selectedDistrict.replace(/\s+/g, '')}/1200/500` : "https://picsum.photos/1200/500";
  const districtImageHint = selectedDistrict ? `${selectedDistrict} landscape` : "Nepal landscape";


  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Explore Nepal's Districts</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover unique attractions, accommodations, AI-powered local tips, and more for each of Nepal's 77 districts.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <Card className="shadow-lg border border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary"><Search className="h-6 w-6" /> Select a District</CardTitle>
              <CardDescription className="text-base">Choose a district to see its details and get AI hidden gem suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Select onValueChange={(value) => handleDistrictChange(value as DistrictName)} value={selectedDistrict || undefined}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  {nepalDistricts.map(d => (
                    <SelectItem key={d} value={d} className="text-base">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedDistrict && (
            <Card className="shadow-lg border border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-accent"><Lightbulb className="h-6 w-6" /> AI Hidden Gems</CardTitle>
                <CardDescription className="text-base">Get AI-powered suggestions for {selectedDistrict}.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSuggestGemsSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="userPreferences" className="font-medium text-base">Your Preferences (Optional)</Label>
                    <Textarea
                      id="userPreferences"
                      placeholder="e.g., interested in nature, history, food, offbeat trails..."
                      {...form.register("userPreferences")}
                      className="mt-1 text-base"
                    />
                  </div>
                  <Button type="submit" disabled={isLoadingGems} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-2.5 h-auto">
                    {isLoadingGems && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoadingGems ? "AI Searching..." : "Find Hidden Gems"}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {isLoading && !districtDetails && (
            <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
                <CardTitle className="text-2xl text-primary">Loading District Data...</CardTitle>
              <CardDescription className="text-lg mt-2">
                Fetching details for {selectedDistrict}.
              </CardDescription>
            </Card>
          )}
          {!isLoading && districtDetails ? (
            <Card className="shadow-xl border">
               <CardHeader className="p-0">
                <div className="aspect-[1200/500] relative rounded-t-lg overflow-hidden"> {/* Adjusted aspect ratio */}
                  <Image
                    src={districtImage}
                    alt={`Image of ${districtDetails.name}`}
                    data-ai-hint={districtImageHint}
                    fill
                    className="object-cover"
                    priority
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                     <h2 className="text-4xl font-bold text-white drop-shadow-lg">{districtDetails.name}</h2>
                     <p className="text-lg text-white/90 mt-1 drop-shadow-md">{districtDetails.tagline}</p>
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
                  <div className="space-y-3 p-4 border rounded-lg bg-accent/10 border-accent/30">
                    <h3 className="text-xl font-semibold text-accent flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" /> AI Hidden Gem Suggestions:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90 text-base">
                      {hiddenGems.hiddenGems.map((gem, index) => (
                        <li key={index}>{gem}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 {hiddenGems && hiddenGems.hiddenGems.length === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Specific Gems Found by AI</AlertTitle>
                    <AlertDescription>AI couldn't find specific hidden gems based on the input. Try broadening your preferences or exploring general attractions below.</AlertDescription>
                  </Alert>
                )}
                {isLoadingGems && (
                     <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-accent" />
                        <p className="text-accent text-base">Searching for hidden gems...</p>
                    </div>
                )}


                <Accordion type="single" collapsible className="w-full" defaultValue="attractions">
                  <AccordionItem value="attractions">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> Top Attractions</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {districtDetails.attractions.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="accommodations">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                     <div className="flex items-center gap-2"><Building className="h-6 w-6 text-primary" /> Accommodations</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {districtDetails.accommodations.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                       <Button variant="link" className="p-0 h-auto text-base mt-2 text-accent hover:text-accent/80">View Booking Options</Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="activities">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><Trees className="h-6 w-6 text-primary" /> Activities & Events</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {districtDetails.activities.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="food">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><Utensils className="h-6 w-6 text-primary" /> Local Cuisine</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {districtDetails.food.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ) : (
             !isLoading && !selectedDistrict && ( // Only show this if not loading and no district selected
                <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
                <CardHeader>
                    <Compass className="h-20 w-20 text-primary mx-auto mb-6" />
                    <CardTitle className="text-3xl">Select a District to Begin</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg max-w-md mx-auto">
                    Choose a district from the list on the left to view its attractions, get AI-powered travel tips, and much more.
                    </CardDescription>
                </CardContent>
                </Card>
             )
          )}
        </div>
      </div>
    </div>
  );
}
