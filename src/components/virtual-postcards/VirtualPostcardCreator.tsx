"use client";

import { useState, ChangeEvent } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateVirtualPostcard, type VirtualPostcardOutput } from '@/ai/flows/virtual-postcards';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ImageIcon, MapPinIcon, Sparkles, Share2, Edit3, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z.any()
    .refine((files) => files?.[0], "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  description: z.string().optional(),
});

export function VirtualPostcardCreator() {
  const [postcard, setPostcard] = useState<VirtualPostcardOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      description: "",
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!imagePreview) {
      setError("Please upload an image.");
      toast({
        title: "Image Required",
        description: "Please upload an image to create a postcard.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPostcard(null);

    try {
      const result = await generateVirtualPostcard({
        imageDataUri: imagePreview,
        location: values.location,
        description: values.description,
      });
      setPostcard(result);
      toast({
        title: "Postcard Caption Generated!",
        description: "Your AI-powered caption is ready.",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to generate postcard caption. Please try again.");
       toast({
        title: "Error",
        description: "Could not generate postcard caption.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Create Virtual Postcards</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your travel photo, add details, and let AI generate a captivating caption for your social media!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl sticky top-24 border border-primary/20">
          <CardHeader className="bg-primary/5 p-6">
            <CardTitle className="flex items-center gap-2 text-primary"><Edit3 className="h-7 w-7" /> Postcard Details</CardTitle>
            <CardDescription className="text-base">Provide an image and some context to generate a caption.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="image" className="font-semibold text-base">Upload Your Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="mt-1 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 h-12 text-base"
                  {...form.register("image")}
                  onChange={(e) => {
                    form.register("image").onChange(e); 
                    handleImageChange(e);
                  }}
                />
                {form.formState.errors.image && <p className="text-sm text-destructive mt-1">{form.formState.errors.image.message as string}</p>}
              </div>

              <div>
                <Label htmlFor="location" className="font-semibold text-base">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Pokhara Lakeside, Annapurna Base Camp"
                  {...form.register("location")}
                  className="mt-1 h-11 text-base"
                />
                {form.formState.errors.location && <p className="text-sm text-destructive mt-1">{form.formState.errors.location.message}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="font-semibold text-base">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Beautiful sunrise, trekking with friends"
                  {...form.register("description")}
                  className="mt-1 text-base"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Caption"}
                 <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
         {isLoading && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
              <CardTitle className="text-2xl text-primary">Generating Postcard...</CardTitle>
              <CardDescription className="text-lg mt-2">
                Our AI is crafting the perfect caption for your image!
              </CardDescription>
            </Card>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Generating Caption</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(!isLoading && (imagePreview || postcard)) && (
            <Card className="shadow-xl border">
              <CardHeader className="bg-primary/5 p-6">
                <CardTitle className="text-2xl text-primary">Your Virtual Postcard Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {imagePreview && (
                  <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-muted shadow-inner">
                    <Image src={imagePreview} alt="Uploaded postcard image" layout="fill" objectFit="contain" />
                  </div>
                )}
                {postcard && postcard.caption && (
                  <div className="p-6 border rounded-lg bg-accent/10 border-accent/30">
                    <h3 className="text-xl font-semibold text-accent mb-2 flex items-center gap-2">
                      <Sparkles className="h-6 w-6" /> AI-Generated Caption:
                    </h3>
                    <p className="text-lg text-foreground/90 whitespace-pre-line">{postcard.caption}</p>
                  </div>
                )}
                 {postcard && !postcard.caption && !error && ( // Show this if AI returns empty caption
                  <Alert>
                     <Info className="h-4 w-4" />
                    <AlertTitle>Caption Not Generated</AlertTitle>
                    <AlertDescription>The AI could not generate a caption for this image. Please try a different image or add more description.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              {postcard && postcard.caption && (
                <CardFooter className="flex justify-end p-6 bg-muted/20 border-t">
                  <Button variant="default" className="text-lg py-2.5 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Share2 className="mr-2 h-5 w-5" /> Share Postcard
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
           {!isLoading && !imagePreview && !error && (
             <Card className="shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 border">
              <CardHeader>
                <ImageIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Create Your Postcard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Upload an image and provide details on the left to generate a unique, AI-powered postcard caption.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
