export function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/50">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Nepal Explorer. All rights reserved.</p>
        <p className="mt-1">Discover the beauty of Nepal.</p>
      </div>
    </footer>
  );
}
