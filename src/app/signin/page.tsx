// src/app/signin/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl border border-destructive/20">
        <CardHeader className="text-center bg-destructive/5 p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-3xl font-bold text-destructive">Sign In Not Available</CardTitle>
          <CardDescription className="text-base">
            This feature is currently not available.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Please return to the <Link href="/" className="font-medium text-primary hover:underline">Homepage</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder pages for links from sign in page (though sign-in itself is removed)
// These are kept in case other parts of the app might link to them,
// or if they are intended to be standalone features later.
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
