
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
// Import SelectGroup and SelectLabel
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { suggestHiddenGems, type SuggestHiddenGemsOutput } from '@/ai/flows/hidden-gems-suggestions';
import { getDistrictDetails, type GetDistrictDetailsOutput } from '@/ai/flows/get-district-details-flow'; // Import the new flow
import { generateDistrictImage, type GenerateDistrictImageOutput } from '@/ai/flows/generate-district-image-flow'; // Import image generation flow
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Lightbulb, Building, Trees, Utensils, Sparkles, Info, Search, ImageOff, Compass } from 'lucide-react'; // Added Compass icon
import { useToast } from "@/hooks/use-toast";
// Import nepalDistrictsByRegion
import { nepalDistricts, type DistrictName, nepalDistrictsByRegion } from '@/types';
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

const formSchema = z.object({
  districtName: z.custom<DistrictName>((val) => nepalDistricts.includes(val as DistrictName), {
    message: "Please select a valid district.",
  }),
  userPreferences: z.string().optional(),
});

// Type for district details state, can be null, loading, or the actual data
type DistrictDetailsState = GetDistrictDetailsOutput | 'loading' | null;
type DistrictImageState = string | 'loading' | null | 'error'; // String is data URI

export function DistrictExplorer() {
  const searchParams = useSearchParams();
  const initialDistrictFromUrl = searchParams.get('name') as DistrictName | null;

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | null>(initialDistrictFromUrl);
  const [districtDetails, setDistrictDetails] = useState<DistrictDetailsState>(null); // Use the new state type
  const [districtImageUrl, setDistrictImageUrl] = useState<DistrictImageState>(null); // State for dynamic image URL
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
    setDistrictImageUrl('loading'); // Set image state to loading
    setDistrictFetchError(null); // Clear previous errors
    setHiddenGems(null); // Reset gems when district changes
    setGemsError(null); // Reset gems error

    let detailsResult: GetDistrictDetailsOutput | null = null;

    try {
      detailsResult = await getDistrictDetails({ districtName });
      setDistrictDetails(detailsResult);
    } catch (e) {
      console.error("Error fetching district details:", e);
      const errorMessage = e instanceof Error ? e.message : "Could not fetch district details.";
      setDistrictFetchError(`Failed to fetch details for ${districtName}. ${errorMessage}`);
      setDistrictDetails(null); // Reset details on error
      setDistrictImageUrl(null); // Reset image URL on text fetch error
      toast({
        title: "Error",
        description: `Could not fetch details for ${districtName}.`,
        variant: "destructive",
      });
      return; // Exit if text details fail
    }

    // If details were fetched successfully, try generating the image
    if (detailsResult) {
      try {
        const imageResult = await generateDistrictImage({ districtName });
        setDistrictImageUrl(imageResult.imageUrl); // Set the data URI
      } catch (imgErr) {
         console.error("Error generating district image:", imgErr);
         setDistrictImageUrl('error'); // Set image state to error
         toast({
           title: "Image Generation Failed",
           description: `Could not generate image for ${districtName}. Displaying details without image.`,
           variant: "default", // Use default or warning, not destructive as text details loaded
         });
      }
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
         setDistrictImageUrl(null); // Clear image URL as well
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
        userPreferences: values.userPreferences || undefined, // Ensure undefined if empty
      });
      setHiddenGems(result);
      toast({
        title: "Hidden Gems Found!",
        description: `AI suggestions for ${values.districtName} generated.`,
      });
    } catch (e) {
      console.error("Error fetching hidden gems:", e);
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
          Discover unique attractions, accommodations, AI-powered local tips, and more for each of Nepal's 77 districts. Plan your Nepal travel and tours efficiently.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6 lg:sticky top-24">
          <Card className="shadow-lg border border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary"><Search className="h-6 w-6" /> Select a District</CardTitle>
              <CardDescription className="text-base">Choose a district to see its details and get AI hidden gem suggestions for your Nepal visit.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Label htmlFor="district-select" className="sr-only">Select a District</Label> {/* Added label for accessibility */}
              {/* Updated Select component with grouped options */}
              <Select
                 onValueChange={(value) => handleDistrictChange(value as DistrictName)}
                 value={selectedDistrict || undefined}
                 name="district-select" // Added name attribute
                >
                <SelectTrigger className="h-12 text-base" id="district-select">
                  <SelectValue placeholder="Select a district" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(nepalDistrictsByRegion).map(([region, districts]) => (
                      <SelectGroup key={region}>
                          <SelectLabel className="font-bold">{region}</SelectLabel>
                          {districts.map(d => (
                              <SelectItem key={d} value={d} className="text-base">{d}</SelectItem>
                          ))}
                      </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedDistrict && (
            <Card className="shadow-lg border border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-accent"><Lightbulb className="h-6 w-6" /> AI Hidden Gems</CardTitle>
                <CardDescription className="text-base">Get AI-powered suggestions for {selectedDistrict} for your off-the-beaten-path tour.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSuggestGemsSubmit)} className="space-y-4">
                   {/* Ensure districtName hidden input for the form */}
                   <input type="hidden" {...form.register("districtName")} value={selectedDistrict || ''}/> {/* Added empty string fallback */}
                  <div>
                    <Label htmlFor="userPreferences" className="font-medium text-base">Your Preferences (Optional)</Label>
                    <Textarea
                      id="userPreferences"
                      placeholder="e.g., interested in nature, history, food, offbeat trails for my Nepal travel..."
                      {...form.register("userPreferences")}
                      className="mt-1 text-base"
                      aria-label="Your preferences for hidden gems"
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
          {/* Loading State for both details and image */}
          {(districtDetails === 'loading' || districtImageUrl === 'loading') && selectedDistrict && (
            <Card className="shadow-xl border">
               <CardHeader className="p-0">
                 <Skeleton className="aspect-[1200/500] w-full rounded-t-lg" />
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                 <Skeleton className="h-8 w-3/4 mb-2" /> {/* Tagline/Title Skeleton */}
                 <Skeleton className="h-6 w-1/2 mb-6" /> {/* Subtitle/Description Skeleton */}
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
          {/* Error State for fetching district text details */}
           {districtFetchError && districtDetails !== 'loading' && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-destructive/10 border border-destructive">
                <CardHeader>
                    <Info className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-2xl text-destructive">Error Loading District Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg text-destructive/90">{districtFetchError}</CardDescription>
                    <Button variant="outline" onClick={() => selectedDistrict && fetchDistrictData(selectedDistrict)} className="mt-6 border-destructive text-destructive hover:bg-destructive/10">
                      Try Again
                    </Button>
                </CardContent>
            </Card>
           )}

          {/* Success State (Details fetched, handle image state) */}
          {districtDetails && typeof districtDetails === 'object' && !districtFetchError && districtImageUrl !== 'loading' ? (
            <Card className="shadow-xl border">
               <CardHeader className="p-0">
                 <div className="aspect-[1200/500] relative rounded-t-lg overflow-hidden bg-muted">
                   {/* Image Display Logic */}
                   {districtImageUrl && typeof districtImageUrl === 'string' ? (
                      <Image
                        src={districtImageUrl} // Use the generated data URI
                        // Enhanced Alt text for SEO
                        alt={`AI generated representation of ${districtDetails.name} district, Nepal. Key landmark or landscape for travel planning.`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority // Prioritize loading the main district image
                      />
                   ) : districtImageUrl === 'error' ? (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                           <ImageOff className="h-16 w-16 mb-4 opacity-50" />
                           <p>Could not load image for {districtDetails.name}.</p>
                       </div>
                   ) : (
                       // Fallback or initial state before image loads (can be Skeleton if preferred, but should be covered by loading state above)
                       <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground">
                         <Skeleton className="h-full w-full" /> {/* Use skeleton as placeholder */}
                       </div>
                   )}
                   {/* Overlay for Text (only show if details are loaded) */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                     <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{districtDetails.name}</h2>
                     <p className="text-md md:text-lg text-white/90 mt-1 drop-shadow-md">{districtDetails.tagline}</p>
                   </div>
                 </div>
               </CardHeader>
              {/* Added ScrollArea with adjusted responsive max-height */}
              <ScrollArea className="max-h-[75vh] w-full">
                <CardContent className="p-6 space-y-6">
                  {/* Hidden Gems Section */}
                  {isLoadingGems && (
                      <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin text-accent" />
                          <p className="text-accent text-base font-medium">AI is searching for hidden gems based on your preferences for your Nepal tour...</p>
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
                                  <li key={index}>{gem}</li> // Gem now includes description
                              ))}
                              </ul>
                          </div>
                       ) : (
                          !gemsError && ( // Only show 'No gems found' if there wasn't an error fetching them
                            <Alert className="bg-muted/50">
                              <Info className="h-4 w-4" />
                              <AlertTitle>No Specific Gems Found</AlertTitle>
                              <AlertDescription>AI couldn't find specific hidden gems based on the input, or none match your preferences. Explore the general attractions below for your Nepal visit!</AlertDescription>
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
                         <p className="mb-2 text-muted-foreground">Must-see places when you visit {districtDetails.name}:</p>
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
                         <p className="mb-2 text-muted-foreground">Where to stay during your tour in {districtDetails.name}:</p>
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
                         <p className="mb-2 text-muted-foreground">Things to do and experience while travelling in {districtDetails.name}:</p>
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
                         <p className="mb-2 text-muted-foreground">Taste the local flavors of {districtDetails.name} during your visit:</p>
                         <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {renderList(districtDetails.food)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </ScrollArea>
            </Card>
          ) : (
             // Initial state when no district is selected and not loading/error
             !selectedDistrict && districtDetails !== 'loading' && !districtFetchError && (
                <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
                <CardHeader>
                    <Compass className="h-20 w-20 text-primary mx-auto mb-6" />
                    <CardTitle className="text-3xl">Select a District to Begin Your Nepal Exploration</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-lg max-w-md mx-auto">
                    Choose a district from the list on the left to view its attractions, get AI-powered travel tips, and plan your perfect Nepal tour or visit.
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
