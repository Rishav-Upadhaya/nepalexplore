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
import { Loader2, Route, CalendarDays, DollarSign, MapPin, Sparkles, ListChecks, Info } from 'lucide-react';
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
        <Card className="lg:col-span-1 shadow-lg sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Route className="text-primary h-6 w-6" /> Plan Your Dream Trip</CardTitle>
            <CardDescription>Fill in your preferences below to get a custom itinerary.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="interests">Interests</Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., trekking, culture, wildlife, spiritual experiences, photography..."
                  {...form.register("interests")}
                  className="mt-1 min-h-[100px]"
                />
                {form.formState.errors.interests && <p className="text-sm text-destructive mt-1">{form.formState.errors.interests.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...form.register("duration")}
                    className="mt-1"
                  />
                  {form.formState.errors.duration && <p className="text-sm text-destructive mt-1">{form.formState.errors.duration.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Select onValueChange={(value) => form.setValue("budget", value as "low" | "medium" | "high")} defaultValue={form.getValues("budget")}>
                    <SelectTrigger id="budget" className="mt-1">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budget && <p className="text-sm text-destructive mt-1">{form.formState.errors.budget.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="startPoint">Starting Point</Label>
                <Input
                  id="startPoint"
                  placeholder="e.g., Kathmandu, Pokhara"
                  {...form.register("startPoint")}
                  className="mt-1"
                />
                {form.formState.errors.startPoint && <p className="text-sm text-destructive mt-1">{form.formState.errors.startPoint.message}</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Itinerary"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Generating Itinerary</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {itinerary && itinerary.itinerary.length > 0 && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><ListChecks className="text-primary h-7 w-7"/> Your Custom Itinerary</CardTitle>
                <CardDescription>Here's a day-by-day plan for your adventure in Nepal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {itinerary.itinerary.map((dayPlan, index) => (
                  <div key={index} className="relative pl-8 group">
                     <span className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                       {dayPlan.day}
                     </span>
                     {index < itinerary.itinerary.length -1 && <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border group-last:hidden" />}
                    <Card className="ml-4 bg-card border-l-4 border-primary shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-secondary" /> {dayPlan.location}
                        </CardTitle>
                         <p className="text-sm text-muted-foreground">Day {dayPlan.day}</p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-1 text-foreground/90">Activities:</h4>
                        <p className="text-muted-foreground whitespace-pre-line">{dayPlan.activities}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                 <Separator className="my-6" />
                <div className="text-center">
                  <Button variant="outline">
                    Export Itinerary (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {itinerary && itinerary.itinerary.length === 0 && (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Itinerary Could Not Be Generated</AlertTitle>
                <AlertDescription>The AI could not generate an itinerary based on your inputs. Please try adjusting your preferences.</AlertDescription>
              </Alert>
          )}
          {!isLoading && !itinerary && !error && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30">
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
