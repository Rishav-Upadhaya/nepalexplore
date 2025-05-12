// src/app/signup/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl border border-primary/20">
        <CardHeader className="text-center bg-primary/5 p-8">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription className="text-base">
            Join Visit Nepal to plan your adventures and save your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
           <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-medium">Full Name</Label>
            <Input id="fullName" type="text" placeholder="Your Name" className="h-11 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-11 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">Password</Label>
            <Input id="password" type="password" placeholder="Create a strong password" className="h-11 text-base" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Retype your password" className="h-11 text-base" />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
            Sign Up
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-8 pt-0 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
