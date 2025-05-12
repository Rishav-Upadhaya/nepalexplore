// src/app/signin/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl border border-primary/20">
        <CardHeader className="text-center bg-primary/5 p-8">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Sign In</CardTitle>
          <CardDescription className="text-base">
            Access your saved itineraries, district explorations, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-11 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="h-11 text-base" />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-8 pt-0 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <Link href="/forgot-password" className="mt-2 text-sm text-muted-foreground hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// Placeholder pages for links from sign in page
export function SignUpPage() {
    return (
        <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
            <h1 className="text-3xl">Sign Up Page (Coming Soon)</h1>
        </div>
    )
}

export function ForgotPasswordPage() {
     return (
        <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
            <h1 className="text-3xl">Forgot Password Page (Coming Soon)</h1>
        </div>
    )
}
