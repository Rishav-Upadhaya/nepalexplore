import Link from 'next/link';
import { MapPinned, Route, Leaf, LogIn, Search, Menu, Mountain, Home } from 'lucide-react'; // Added Home icon
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/', label: 'Home', icon: Home }, // Added Home link
  { href: '/districts', label: 'Districts', icon: MapPinned },
  { href: '/plan-trip', label: 'Plan Your Trip', icon: Route },
  { href: '/sustainability', label: 'Sustainability', icon: Leaf },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Replace with a proper logo SVG if available */}
          {/* Using Mountain as a placeholder, adjust as needed */}
          <Mountain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight text-primary">Visit Nepal</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-accent flex items-center gap-1.5" // Added flex for icon alignment
            >
               <item.icon className="h-4 w-4" /> {/* Added icon */}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/signin">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
             {/* Changed Explore Now to point to Plan Trip */}
            <Link href="/plan-trip">
              <Search className="mr-2 h-4 w-4" />
              Start Planning
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background p-0">
              <div className="flex h-full flex-col">
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center gap-2">
                    <Mountain className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary">Visit Nepal</span>
                  </Link>
                </div>
                <nav className="flex-1 flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                     <SheetClose asChild key={item.label}>
                        <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-muted hover:text-primary"
                        >
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <Separator />
                <div className="p-4 space-y-3">
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/signin">
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                            </Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" asChild>
                            {/* Changed Explore Now to point to Plan Trip */}
                            <Link href="/plan-trip">
                            <Search className="mr-2 h-4 w-4" />
                            Start Planning
                            </Link>
                        </Button>
                    </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
