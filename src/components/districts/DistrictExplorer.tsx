
"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { getDistrictDetails, type GetDistrictDetailsOutput } from '@/ai/flows/get-district-details-flow'; // Import the new flow
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Lightbulb, Building, Trees, Utensils, Sparkles, Info, Compass, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { nepalDistricts, type DistrictName } from '@/types';
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const formSchema = z.object({
  districtName: z.custom<DistrictName>((val) => nepalDistricts.includes(val as DistrictName), {
    message: "Please select a valid district.",
  }),
  userPreferences: z.string().optional(),
});

// Type for district details state, can be null, loading, or the actual data
type DistrictDetailsState = GetDistrictDetailsOutput | 'loading' | null;

export function DistrictExplorer() {
  const searchParams = useSearchParams();
  const initialDistrictFromUrl = searchParams.get('name') as DistrictName | null;

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | null>(initialDistrictFromUrl);
  const [districtDetails, setDistrictDetails] = useState<DistrictDetailsState>(null); // Use the new state type
  const [hiddenGems, setHiddenGems] = useState<SuggestHiddenGemsOutput | null>(null);
  const [isLoadingGems, setIsLoadingGems] = useState(false);
  const [districtFetchError, setDistrictFetchError] = useState<string | null>(null); // Specific error state for district details
  const [gemsError, setGemsError] = useState<string | null>(null); // Specific error state for hidden gems
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      districtName: initialDistrictFromUrl || undefined,
      userPreferences: "",
    },
  });

  // Use useCallback to memoize fetchDistrictData
  const fetchDistrictData = useCallback(async (districtName: DistrictName) => {
    setDistrictDetails('loading'); // Set state to loading
    setDistrictFetchError(null); // Clear previous errors
    setHiddenGems(null); // Reset gems when district changes
    setGemsError(null); // Reset gems error
    try {
      const result = await getDistrictDetails({ districtName });
      setDistrictDetails(result);
    } catch (e) {
      console.error("Error fetching district details:", e);
      const errorMessage = e instanceof Error ? e.message : "Could not fetch district details.";
      setDistrictFetchError(`Failed to fetch details for ${districtName}. ${errorMessage}`);
      setDistrictDetails(null); // Reset details on error
      toast({
        title: "Error",
        description: `Could not fetch details for ${districtName}.`,
        variant: "destructive",
      });
    }
  }, [toast]); // Add toast as dependency

  // Effect to handle initial district from URL
  useEffect(() => {
    if (initialDistrictFromUrl && nepalDistricts.includes(initialDistrictFromUrl)) {
      setSelectedDistrict(initialDistrictFromUrl);
       form.setValue("districtName", initialDistrictFromUrl);
       // Fetch data only if it hasn't been fetched or if the district changes
       if (districtDetails === null || (districtDetails !== 'loading' && districtDetails?.name !== initialDistrictFromUrl)) {
            fetchDistrictData(initialDistrictFromUrl);
       }
    } else {
         setDistrictDetails(null); // Clear details if no valid initial district
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDistrictFromUrl]); // Run only when URL param changes

  // Effect to fetch data when selectedDistrict changes *manually* by user
  useEffect(() => {
      if (selectedDistrict && selectedDistrict !== initialDistrictFromUrl && (districtDetails === null || (districtDetails !== 'loading' && districtDetails?.name !== selectedDistrict))) {
          fetchDistrictData(selectedDistrict);
          form.setValue("districtName", selectedDistrict);
          // Resetting gems handled in fetchDistrictData now
      }
  // Only trigger for manual changes different from URL load or if details are missing/mismatched
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict, initialDistrictFromUrl, fetchDistrictData]);


  const onSuggestGemsSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsLoadingGems(true);
    setGemsError(null); // Clear previous gems error
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
      const errorMessage = e instanceof Error ? e.message : "Could not fetch hidden gems.";
      setGemsError(`Failed to fetch hidden gems. ${errorMessage}`);
      toast({
        title: "Error",
        description: "Could not fetch hidden gems.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGems(false);
    }
  }, [toast]); // Add toast as dependency

  const handleDistrictChange = useCallback((district: DistrictName) => {
    setSelectedDistrict(district);
    // Update URL without full page reload
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('name', district);
    window.history.pushState({}, '', `${window.location.pathname}?${currentParams.toString()}`);
  }, []); // No dependencies needed as it only uses setSelectedDistrict and browser APIs

  const districtImage = selectedDistrict ? `https://picsum.photos/seed/${selectedDistrict.replace(/\s+/g, '')}/1200/500` : "https://picsum.photos/1200/500";
  const districtImageHint = selectedDistrict ? `${selectedDistrict} landscape` : "Nepal landscape";


  // Helper function to render lists or placeholder
  const renderList = (items: string[] | undefined) => {
      if (!items || items.length === 0) {
          return <li className="text-muted-foreground italic">Details coming soon...</li>;
      }
      return items.map((item, i) => <li key={i}>{item}</li>);
  };


  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Explore Nepal's Districts</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover unique attractions, accommodations, AI-powered local tips, and more for each of Nepal's 77 districts.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar */}
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
                   {/* Ensure districtName hidden input for the form */}
                   <input type="hidden" {...form.register("districtName")} value={selectedDistrict}/>
                  <div>
                    <Label htmlFor="userPreferences" className="font-medium text-base">Your Preferences (Optional)</Label>
                    <Textarea
                      id="userPreferences"
                      placeholder="e.g., interested in nature, history, food, offbeat trails..."
                      {...form.register("userPreferences")}
                      className="mt-1 text-base"
                    />
                  </div>
                  <Button type="submit" disabled={isLoadingGems || districtDetails === 'loading'} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-2.5 h-auto">
                    {isLoadingGems && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoadingGems ? "AI Searching..." : "Find Hidden Gems"}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                 {gemsError && (
                  <Alert variant="destructive" className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{gemsError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

         {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Loading State */}
          {districtDetails === 'loading' && (
            <Card className="shadow-xl border">
               <CardHeader className="p-0">
                 <Skeleton className="aspect-[1200/500] w-full rounded-t-lg" />
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 <Skeleton className="h-8 w-3/4 mb-2" /> {/* Tagline Skeleton */}
                 <Skeleton className="h-6 w-1/2 mb-6" /> {/* Subtitle Skeleton */}
                  {/* Accordion Skeletons */}
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
               </CardContent>
            </Card>
          )}
          {/* Error State */}
           {districtFetchError && districtDetails !== 'loading' && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-destructive/10 border border-destructive">
                <CardHeader>
                    <Info className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl text-destructive">Error Loading District Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg text-destructive/90">{districtFetchError}</CardDescription>
                    <Button variant="outline" onClick={() => selectedDistrict && fetchDistrictData(selectedDistrict)} className="mt-6 border-destructive text-destructive hover:bg-destructive/10">
                      {/* Add loader if needed during retry */}
                      Try Again
                    </Button>
                </CardContent>
            </Card>
           )}

          {/* Success State */}
          {districtDetails && typeof districtDetails === 'object' && !districtFetchError ? (
            <Card className="shadow-xl border">
               <CardHeader className="p-0">
                <div className="aspect-[1200/500] relative rounded-t-lg overflow-hidden bg-muted"> {/* Added bg-muted for placeholder */}
                  <Image
                    src={districtImage}
                    alt={`Image of ${districtDetails.name}`}
                    data-ai-hint={districtImageHint}
                    fill
                    className="object-cover"
                    priority={!initialDistrictFromUrl} // Load priority only if not coming from direct link initially
                    sizes="(max-width: 1024px) 100vw, 66vw" // Updated sizes for better optimization
                    unoptimized={!selectedDistrict} // Don't optimize the default placeholder
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/1200/500'; }} // Fallback image
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                     <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{districtDetails.name}</h2>
                     <p className="text-md md:text-lg text-white/90 mt-1 drop-shadow-md">{districtDetails.tagline}</p>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {/* Hidden Gems Section */}
                 {isLoadingGems && (
                     <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-accent" />
                        <p className="text-accent text-base">Searching for hidden gems...</p>
                    </div>
                 )}
                {hiddenGems && !isLoadingGems && (
                    hiddenGems.hiddenGems.length > 0 ? (
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
                     ) : (
                        !gemsError && ( // Only show 'No gems found' if there wasn't an error fetching them
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>No Specific Gems Found by AI</AlertTitle>
                            <AlertDescription>AI couldn't find specific hidden gems based on the input. Explore the general attractions below.</AlertDescription>
                          </Alert>
                        )
                    )
                )}


                {/* District Details Accordion */}
                <Accordion type="single" collapsible className="w-full" defaultValue="attractions">
                  <AccordionItem value="attractions">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> Top Attractions</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {renderList(districtDetails.attractions)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="accommodations">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                     <div className="flex items-center gap-2"><Building className="h-6 w-6 text-primary" /> Accommodations</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {renderList(districtDetails.accommodations)}
                      </ul>
                       {/* Consider adding a real booking link later */}
                       {/* <Button variant="link" className="p-0 h-auto text-base mt-2 text-accent hover:text-accent/80">View Booking Options</Button> */}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="activities">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><Trees className="h-6 w-6 text-primary" /> Activities & Events</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                         {renderList(districtDetails.activities)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="food">
                    <AccordionTrigger className="text-xl font-medium hover:text-primary py-3">
                      <div className="flex items-center gap-2"><Utensils className="h-6 w-6 text-primary" /> Local Cuisine</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-3 text-base">
                       <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {renderList(districtDetails.food)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ) : (
             // Initial state when no district is selected and not loading/error
             !selectedDistrict && districtDetails !== 'loading' && !districtFetchError && (
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
