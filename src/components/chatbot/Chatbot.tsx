
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2, User, Bot } from 'lucide-react';
import { tourGuideChat } from '@/ai/flows/tour-guide-chat-flow';
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    // Updated initial message for politeness
    { role: 'model', content: 'Namaste! I\'m Pasang, your friendly AI guide for Nepal Explorer. It would be my pleasure to assist you with planning your trip. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);


  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await tourGuideChat({
        history: messages, // Send current history
        userMessage: userMessage.content,
      });
      const modelMessage: Message = { role: 'model', content: result.response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast({
        title: "Chat Error",
        description: "Sorry, I couldn't process that request. Please try again.",
        variant: "destructive",
      });
       // Optionally add an error message to the chat
       setMessages(prev => [...prev, { role: 'model', content: 'My apologies, I encountered an error. Could you please try asking again?' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, toast]); // Add dependencies

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  }, [handleSendMessage, isLoading]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-xl bg-accent hover:bg-accent/90 text-accent-foreground z-50 flex items-center justify-center p-0"
          aria-label="Open Chat Guide"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-muted/50">
          {/* Added accessible title */}
           <SheetTitle className="sr-only">AI Tour Guide Pasang Chat Window</SheetTitle>
          <div className="flex items-center gap-2 text-lg">
            <Bot className="h-6 w-6 text-primary" /> AI Tour Guide (Pasang)
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4"> {/* Add padding-bottom */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    {/* Placeholder for a Sherpa avatar */}
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 shadow ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-accent text-accent-foreground"><User size={18}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 shadow flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground italic">Pasang is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t bg-muted/50 mt-auto"> {/* Ensure footer is at the bottom */}
          <div className="flex items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Ask Pasang anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 h-11 text-base"
              aria-label="Chat input"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="h-11" aria-label="Send message">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
