// use server'

/**
 * @fileOverview Generates captions for virtual postcards based on uploaded images.
 *
 * - generateVirtualPostcard - A function that generates captions for virtual postcards.
 * - VirtualPostcardInput - The input type for the generateVirtualPostcard function.
 * - VirtualPostcardOutput - The return type for the generateVirtualPostcard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VirtualPostcardInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image for the virtual postcard, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The location where the image was taken.'),
  description: z
    .string()
    .optional()
    .describe('Optional user-provided description of the image.'),
});
export type VirtualPostcardInput = z.infer<typeof VirtualPostcardInputSchema>;

const VirtualPostcardOutputSchema = z.object({
  caption: z.string().describe('The generated caption for the virtual postcard.'),
});
export type VirtualPostcardOutput = z.infer<typeof VirtualPostcardOutputSchema>;

export async function generateVirtualPostcard(
  input: VirtualPostcardInput
): Promise<VirtualPostcardOutput> {
  return generateVirtualPostcardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'virtualPostcardPrompt',
  input: {schema: VirtualPostcardInputSchema},
  output: {schema: VirtualPostcardOutputSchema},
  prompt: `You are an AI assistant specializing in creating engaging captions for virtual postcards.

  Based on the image, location, and any additional description, generate a creative and captivating caption suitable for sharing on social media.

  Location: {{{location}}}
  Description: {{description}}
  Image: {{media url=imageDataUri}}

  Caption: `,
});

const generateVirtualPostcardFlow = ai.defineFlow(
  {
    name: 'generateVirtualPostcardFlow',
    inputSchema: VirtualPostcardInputSchema,
    outputSchema: VirtualPostcardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
