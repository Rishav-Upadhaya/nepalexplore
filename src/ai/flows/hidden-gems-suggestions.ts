// This file holds the Genkit flow for suggesting hidden gems and off-the-beaten-path locations within a specific district.

'use server';

/**
 * @fileOverview An AI agent that suggests hidden gems and off-the-beaten-path locations within a specific district.
 *
 * - suggestHiddenGems - A function that suggests hidden gems.
 * - SuggestHiddenGemsInput - The input type for the suggestHiddenGems function.
 * - SuggestHiddenGemsOutput - The return type for the suggestHiddenGems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHiddenGemsInputSchema = z.object({
  districtName: z.string().describe('The name of the district to explore.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences to tailor the suggestions.'),
});
export type SuggestHiddenGemsInput = z.infer<typeof SuggestHiddenGemsInputSchema>;

const SuggestHiddenGemsOutputSchema = z.object({
  hiddenGems: z
    .array(z.string())
    .describe('An array of hidden gem location suggestions.'),
});
export type SuggestHiddenGemsOutput = z.infer<typeof SuggestHiddenGemsOutputSchema>;

export async function suggestHiddenGems(
  input: SuggestHiddenGemsInput
): Promise<SuggestHiddenGemsOutput> {
  return suggestHiddenGemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHiddenGemsPrompt',
  input: {schema: SuggestHiddenGemsInputSchema},
  output: {schema: SuggestHiddenGemsOutputSchema},
  prompt: `You are a local travel expert, intimately familiar with all the hidden gems and off-the-beaten-path locations in Nepal.

  A user is exploring the district of {{districtName}} and is looking for unique and interesting places to visit that are not typically found in standard tourist guides.

  User Preferences: {{userPreferences}}

  Suggest some hidden gems and off-the-beaten-path locations, return them as a list of strings.
  `,
});

const suggestHiddenGemsFlow = ai.defineFlow(
  {
    name: 'suggestHiddenGemsFlow',
    inputSchema: SuggestHiddenGemsInputSchema,
    outputSchema: SuggestHiddenGemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
