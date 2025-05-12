
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiItineraryTool, type AiItineraryToolOutput } from '@/ai/flows/ai-itinerary-tool';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Route, CalendarDays, DollarSign, MapPinIcon, Sparkles, ListChecks, Info, FileText, Shuffle, Edit, Hotel } from 'lucide-react'; // Added Hotel icon
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { nepalDistrictsByRegion, type DistrictName } from '@/types';

// Define schema for both types
const formSchema = z.object({
  itineraryType: z.enum(["custom", "random"], { required_error: "Please select an itinerary type." }),
  interests: z.string().optional(), // Optional for random
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 day." }).max(30, { message: "Duration cannot exceed 30 days."}),
  budget: z.enum(["low", "medium", "high"], { required_error: "Please select a budget." }),
  startPoint: z.string({required_error: "Please select a starting point."}).min(1, { message: "Please select a starting point." }),
  endPoint: z.string().optional(),
  mustVisitPlaces: z.string().optional(),
}).refine(data => {
    // Require interests for custom itinerary
    if (data.itineraryType === 'custom' && (!data.interests || data.interests.length < 10)) {
      return false;
    }
    return true;
  }, {
    message: "Please describe your interests (min 10 characters) for a custom itinerary.",
    path: ["interests"], // Path to the field to attach the error message
  });


export function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState<AiItineraryToolOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itineraryType: "custom", // Default to custom
      interests: "",
      duration: 7,
      budget: undefined,
      startPoint: "Kathmandu", // Default starting point
      endPoint: "",
      mustVisitPlaces: "",
    },
  });

  const itineraryType = form.watch("itineraryType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      // Clear optional fields if 'random' is selected
      const payload = values.itineraryType === 'random' ? {
        ...values,
        interests: undefined, // Ensure interests are not sent for random
        endPoint: undefined,
        mustVisitPlaces: undefined,
      } : {
          ...values,
          // Handle the "none" value for optional dropdowns
          endPoint: values.endPoint === "none" || values.endPoint === "" ? undefined : values.endPoint,
          mustVisitPlaces: values.mustVisitPlaces === "none" || values.mustVisitPlaces === "" ? undefined : values.mustVisitPlaces,
        };

      const result = await aiItineraryTool(payload);
      setItinerary(result);
      toast({
        title: "Itinerary Generated!",
        description: `Your ${values.itineraryType} travel plan is ready.`,
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Failed to generate itinerary. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">AI-Powered Itinerary Builder</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your style: craft a detailed custom trip or let AI surprise you with a random adventure!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl sticky top-24 border border-primary/20">
          <CardHeader className="bg-primary/5 p-6">
            <CardTitle className="flex items-center gap-2 text-primary"><Route className="h-7 w-7" /> Plan Your Trip</CardTitle>
            <CardDescription className="text-base">Select your preferences below.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="itineraryType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-semibold text-base">Choose Itinerary Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" id="custom" />
                            </FormControl>
                            <FormLabel htmlFor="custom" className="font-medium text-base flex items-center gap-1.5 cursor-pointer">
                               <Edit className="h-4 w-4"/> Custom Plan
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="random" id="random" />
                            </FormControl>
                            <FormLabel htmlFor="random" className="font-medium text-base flex items-center gap-1.5 cursor-pointer">
                                <Shuffle className="h-4 w-4"/> Random Adventure
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Common Fields */}
                 <FormField
                    control={form.control}
                    name="startPoint"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold text-base">Starting Point</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-11 text-base">
                                    <SelectValue placeholder="Select starting district" />
                                </SelectTrigger>
                            </FormControl>
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
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-base">Duration (days)</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} className="h-11 text-base"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-base">Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-11 text-base">
                                <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="low" className="text-base">Low</SelectItem>
                                <SelectItem value="medium" className="text-base">Medium</SelectItem>
                                <SelectItem value="high" className="text-base">High</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>


                {/* Custom Fields */}
                {itineraryType === 'custom' && (
                  <>
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-base">Your Interests</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., trekking in Annapurna, exploring ancient temples in Kathmandu, spotting wildlife in Chitwan..."
                              className="min-h-[100px] text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="endPoint"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-base">Ending Point (Optional)</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                                <FormControl>
                                    <SelectTrigger className="h-11 text-base">
                                        <SelectValue placeholder="Select ending district (optional)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                     <SelectItem value="none" className="text-base italic">None (leave blank)</SelectItem>
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
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                      control={form.control}
                      name="mustVisitPlaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-base">Must-Visit Places/Regions (Optional)</FormLabel>
                           <FormControl>
                            <Textarea
                              placeholder="List specific places or regions, e.g., Lumbini, Everest Base Camp region, Bardia..."
                              className="min-h-[80px] text-base"
                              {...field}
                            />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                 {/* Random Specific Info/Fields (if any needed in future) */}
                 {/* {itineraryType === 'random' && ( <p className="text-sm text-muted-foreground">Let AI choose the best route for you!</p> )} */}


                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
                  {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isLoading ? "Generating..." : (itineraryType === 'custom' ? "Generate Custom Itinerary" : "Generate Random Adventure")}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Itinerary Display Area */}
        <div className="lg:col-span-2">
          {isLoading && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
              <CardTitle className="text-2xl text-primary">Generating Your Itinerary...</CardTitle>
              <CardDescription className="text-lg mt-2">
                Please wait while our AI crafts your personalized adventure!
              </CardDescription>
            </Card>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Generating Itinerary</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {itinerary && itinerary.itinerary.length > 0 && !isLoading && (
            <Card className="shadow-xl border">
              <CardHeader className="bg-primary/5 p-6">
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                  <ListChecks className="h-8 w-8"/> Your {form.getValues('itineraryType') === 'custom' ? 'Custom' : 'Random'} Itinerary
                </CardTitle>
                <CardDescription className="text-base">Here's a day-by-day plan for your adventure in Nepal.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 {/* Timeline View Placeholder */}
                 <div className="p-4 border rounded-lg bg-muted/50 text-center">
                    <h3 className="text-lg font-semibold text-primary mb-2">Interactive Timeline View</h3>
                    <p className="text-muted-foreground text-sm">(Coming Soon: Visualize your itinerary on an interactive timeline!)</p>
                  </div>
                {itinerary.itinerary.map((dayPlan, index) => (
                   <div key={index} className="relative pl-10 group">
                     <span className="absolute left-[-2px] top-1 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow z-10">
                       {dayPlan.day}
                     </span>
                     {/* Vertical line connecting days */}
                     {index < itinerary.itinerary.length - 1 && (
                        <div className="absolute left-[17px] top-10 bottom-[-1.5rem] w-0.5 bg-border group-last:hidden" />
                     )}
                    <Card className="ml-6 bg-card border-l-4 border-accent shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPinIcon className="h-6 w-6 text-accent" /> {dayPlan.location}
                        </CardTitle>
                         <p className="text-sm text-muted-foreground font-medium">Day {dayPlan.day}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3">
                        <div>
                            <h4 className="font-semibold mb-1.5 text-foreground/90 text-base">Activities:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-base">
                              {dayPlan.activities?.map((activity, actIndex) => (
                                  <li key={actIndex}>{activity}</li>
                              ))}
                              {(!dayPlan.activities || dayPlan.activities.length === 0) && (
                                   <li className="italic">No specific activities listed for today.</li>
                              )}
                            </ul>
                        </div>
                         {dayPlan.hotelRecommendations && dayPlan.hotelRecommendations.length > 0 && (
                            <div>
                                <Separator className="my-3" />
                                <h4 className="font-semibold mb-1.5 text-foreground/90 text-base flex items-center gap-1.5">
                                    <Hotel className="h-5 w-5 text-primary" /> Hotel Recommendations:
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-base">
                                {dayPlan.hotelRecommendations.map((hotel, hotelIndex) => (
                                    <li key={hotelIndex}>{hotel}</li>
                                ))}
                                </ul>
                            </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {itinerary && itinerary.itinerary.length === 0 && !isLoading && (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Itinerary Could Not Be Generated</AlertTitle>
                <AlertDescription>The AI could not generate an itinerary based on your inputs. Please try adjusting your preferences.</AlertDescription>
              </Alert>
          )}
          {!isLoading && !itinerary && !error && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
              <CardHeader>
                <Route className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Ready for an Adventure?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Choose 'Custom Plan' or 'Random Adventure' on the left and let AI craft your Nepal itinerary!
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
