
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from "@/components/ui/toaster";
import { Chatbot } from '@/components/chatbot/Chatbot'; // Import the Chatbot component


interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Chatbot /> {/* Add the Chatbot component */}
      <Toaster />
    </div>
  );
}
