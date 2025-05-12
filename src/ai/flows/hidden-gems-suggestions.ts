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
    .describe('Optional user preferences (e.g., nature, history, food) to tailor the suggestions.'),
});
export type SuggestHiddenGemsInput = z.infer<typeof SuggestHiddenGemsInputSchema>;

const SuggestHiddenGemsOutputSchema = z.object({
  hiddenGems: z
    .array(z.string())
    .describe('An array of 3-5 specific hidden gem location suggestions with brief descriptions.'),
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
  prompt: `You are a local travel expert, intimately familiar with all the hidden gems and off-the-beaten-path locations in Nepal's districts.

A user is exploring the district of **{{{districtName}}}**.

{{#if userPreferences}}
They have specific interests: **{{{userPreferences}}}**. You **MUST** tailor your suggestions based on these preferences. Focus on locations or experiences that align directly with what the user is looking for.
{{else}}
They haven't specified particular interests, so suggest a diverse range of unique and interesting places or experiences that are not typically found in standard tourist guides for this district.
{{/if}}

Suggest 3-5 specific hidden gems or off-the-beaten-path locations/experiences within **{{{districtName}}}**. For each suggestion, provide a brief description (1-2 sentences) explaining why it's a hidden gem.

Return the suggestions as a JSON array of strings, where each string is a gem suggestion including its brief description.

Example Output Format:
{
  "hiddenGems": [
    "Panchase Village Trek: A shorter, less crowded trek offering stunning Annapurna views and authentic village experiences.",
    "Begnas Lake: Quieter and less commercialized than Phewa Lake, perfect for peaceful boating and relaxation.",
    "Gupteshwor Mahadev Cave (lesser-known section): Explore the deeper, more challenging parts of the cave system often missed by tourists."
  ]
}
`,
});

const suggestHiddenGemsFlow = ai.defineFlow(
  {
    name: 'suggestHiddenGemsFlow',
    inputSchema: SuggestHiddenGemsInputSchema,
    outputSchema: SuggestHiddenGemsOutputSchema,
  },
  async input => {
     // Ensure optional userPreferences is passed correctly (as undefined if empty/null)
    const processedInput = {
        ...input,
        userPreferences: input.userPreferences || undefined,
    };
    const {output} = await prompt(processedInput);
    return output!;
  }
);
