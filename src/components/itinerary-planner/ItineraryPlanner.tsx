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
import { aiItineraryTool, type AiItineraryToolOutput } from '@/ai/flows/ai-itinerary-tool';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Route, CalendarDays, DollarSign, MapPinIcon, Sparkles, ListChecks, Info, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  interests: z.string().min(10, { message: "Please describe your interests (min 10 characters)." }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 day." }).max(30, { message: "Duration cannot exceed 30 days."}),
  budget: z.enum(["low", "medium", "high"], { required_error: "Please select a budget." }),
  startPoint: z.string().min(3, { message: "Starting point must be at least 3 characters." }),
});

export function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState<AiItineraryToolOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      duration: 7,
      budget: undefined,
      startPoint: "Kathmandu",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const result = await aiItineraryTool(values);
      setItinerary(result);
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized travel plan is ready.",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to generate itinerary. Please try again.");
      toast({
        title: "Error",
        description: "Could not generate itinerary.",
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
          Let our AI craft the perfect Nepal adventure for you. Just tell us your preferences!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl sticky top-24 border border-primary/20">
          <CardHeader className="bg-primary/5 p-6">
            <CardTitle className="flex items-center gap-2 text-primary"><Route className="h-7 w-7" /> Plan Your Dream Trip</CardTitle>
            <CardDescription className="text-base">Fill in your preferences below to get a custom itinerary.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="interests" className="font-semibold text-base">Your Interests</Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., trekking, culture, wildlife, spiritual experiences, photography..."
                  {...form.register("interests")}
                  className="mt-1 min-h-[100px] text-base"
                />
                {form.formState.errors.interests && <p className="text-sm text-destructive mt-1">{form.formState.errors.interests.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="font-semibold text-base">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...form.register("duration")}
                    className="mt-1 h-11 text-base"
                  />
                  {form.formState.errors.duration && <p className="text-sm text-destructive mt-1">{form.formState.errors.duration.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="budget" className="font-semibold text-base">Budget</Label>
                  <Select onValueChange={(value) => form.setValue("budget", value as "low" | "medium" | "high")} defaultValue={form.getValues("budget")}>
                    <SelectTrigger id="budget" className="mt-1 h-11 text-base">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="text-base">Low</SelectItem>
                      <SelectItem value="medium" className="text-base">Medium</SelectItem>
                      <SelectItem value="high" className="text-base">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budget && <p className="text-sm text-destructive mt-1">{form.formState.errors.budget.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="startPoint" className="font-semibold text-base">Starting Point</Label>
                <Input
                  id="startPoint"
                  placeholder="e.g., Kathmandu, Pokhara"
                  {...form.register("startPoint")}
                  className="mt-1 h-11 text-base"
                />
                {form.formState.errors.startPoint && <p className="text-sm text-destructive mt-1">{form.formState.errors.startPoint.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Itinerary"}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

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
                <CardTitle className="text-2xl flex items-center gap-2 text-primary"><ListChecks className="h-8 w-8"/> Your Custom Itinerary</CardTitle>
                <CardDescription className="text-base">Here's a day-by-day plan for your adventure in Nepal.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {itinerary.itinerary.map((dayPlan, index) => (
                  <div key={index} className="relative pl-10 group">
                     <span className="absolute left-0 top-1 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow">
                       {dayPlan.day}
                     </span>
                     {index < itinerary.itinerary.length -1 && <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-border group-last:hidden" />}
                    <Card className="ml-6 bg-card border-l-4 border-accent shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPinIcon className="h-6 w-6 text-accent" /> {dayPlan.location}
                        </CardTitle>
                         <p className="text-sm text-muted-foreground font-medium">Day {dayPlan.day}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <h4 className="font-semibold mb-1 text-foreground/90 text-base">Activities:</h4>
                        <p className="text-muted-foreground whitespace-pre-line text-base">{dayPlan.activities}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                 <Separator className="my-8" />
                <div className="text-center">
                  <Button variant="outline" className="text-lg py-3 h-auto border-primary text-primary hover:bg-primary/10">
                    <FileText className="mr-2 h-5 w-5" />
                    Export Itinerary (PDF)
                  </Button>
                </div>
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
                  Fill out your preferences on the left, and let our AI craft your personalized Nepal itinerary!
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
