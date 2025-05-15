// src/app/forgot-password/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl border border-primary/20">
        <CardHeader className="text-center bg-primary/5 p-8">
          <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Forgot Password?</CardTitle>
          <CardDescription className="text-base">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-11 text-base" />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 h-auto">
            Send Reset Link
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-8 pt-0 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {/* Removed link to Sign In */}
            Password recovery is for future use.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
