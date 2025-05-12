
'use server';
/**
 * @fileOverview An AI-powered conversational tour guide for Nepal.
 *
 * - tourGuideChat - Handles conversation turns with the AI guide.
 * - TourGuideChatInput - Input type for the tourGuideChat function.
 * - TourGuideChatOutput - Output type for the tourGuideChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define conversation history schema
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']), // Role can be user or the AI model
  content: z.string(),
});
type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define input schema without the raw history, will pass formatted string instead
const FormattedHistoryInputSchema = z.object({
  formattedHistory: z.string().describe('The formatted conversation history.'),
  userMessage: z.string().describe('The latest message from the user.'),
});

// Original input schema for the exported function remains the same
const TourGuideChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history so far.'),
  userMessage: z.string().describe('The latest message from the user.'),
});
export type TourGuideChatInput = z.infer<typeof TourGuideChatInputSchema>;

const TourGuideChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user\'s message.'),
});
export type TourGuideChatOutput = z.infer<typeof TourGuideChatOutputSchema>;

export async function tourGuideChat(input: TourGuideChatInput): Promise<TourGuideChatOutput> {
  return tourGuideChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourGuideChatPrompt',
  input: {schema: FormattedHistoryInputSchema}, // Use the schema with formatted history
  output: {schema: TourGuideChatOutputSchema},
  prompt: `You are Pasang, a friendly and knowledgeable Sherpa tour guide for Nepal Explorer. Your goal is to assist users in planning their trip, answer their questions about Nepal's culture, geography, attractions, trekking, food, and provide helpful travel tips. Maintain a warm, encouraging, and slightly informal tone.

Keep your responses concise and helpful. You can answer questions about specific districts, suggest activities based on interests, explain cultural nuances, or give practical advice (like packing tips or best times to visit).

Remember your persona: Pasang, the experienced Sherpa guide.

Conversation History:
{{{formattedHistory}}}

Current User Message:
User: {{{userMessage}}}

Your Response:
Pasang: `,
  config: {
    // Optional: Adjust temperature for creativity vs. factuality
    // temperature: 0.7,
    // Optional: Lower safety settings if appropriate, but be cautious
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

// Remove the helper registration
// ai.registry.defineHelper('eq', (a, b) => a === b);


const tourGuideChatFlow = ai.defineFlow(
  {
    name: 'tourGuideChatFlow',
    // Input/Output schemas here are for the flow *function*, not the prompt itself
    inputSchema: TourGuideChatInputSchema, // Flow takes the original input structure
    outputSchema: TourGuideChatOutputSchema,
  },
  async input => {
    // Format the history here
    const formattedHistory = input.history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Pasang'}: ${msg.content}`)
      .join('\n');

    // Pass the formatted history and user message to the prompt
    const {output} = await prompt({
        formattedHistory: formattedHistory,
        userMessage: input.userMessage
    });
    return output!;
  }
);

