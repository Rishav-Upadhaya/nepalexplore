// src/ai/flows/get-district-details-flow.ts
'use server';

/**
 * @fileOverview Provides detailed information about a specific Nepalese district using AI.
 *
 * - getDistrictDetails - Fetches district details like attractions, accommodation, etc.
 * - GetDistrictDetailsInput - Input type for the getDistrictDetails function.
 * - GetDistrictDetailsOutput - Output type for the getDistrictDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDistrictDetailsInputSchema = z.object({
  districtName: z.string().describe('The name of the Nepalese district to get details for.'),
});
export type GetDistrictDetailsInput = z.infer<typeof GetDistrictDetailsInputSchema>;

const GetDistrictDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the district.'),
  tagline: z.string().describe('A catchy and descriptive tagline for the district.'),
  attractions: z.array(z.string()).describe('A list of 3-5 top attractions in the district.'),
  accommodations: z.array(z.string()).describe('A list of 2-4 common types of accommodations found in the district (e.g., Luxury Lodges, Homestays).'),
  activities: z.array(z.string()).describe('A list of 3-5 popular activities or events in the district.'),
  food: z.array(z.string()).describe('A list of 2-4 notable local dishes or food specialties.'),
});
export type GetDistrictDetailsOutput = z.infer<typeof GetDistrictDetailsOutputSchema>;

export async function getDistrictDetails(input: GetDistrictDetailsInput): Promise<GetDistrictDetailsOutput> {
  return getDistrictDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDistrictDetailsPrompt',
  input: {schema: GetDistrictDetailsInputSchema},
  output: {schema: GetDistrictDetailsOutputSchema},
  prompt: `You are a knowledgeable and enthusiastic Nepal travel expert. Provide detailed information about the district: {{{districtName}}}.

Generate the following details:
1.  **name:** The exact district name: {{{districtName}}}.
2.  **tagline:** Create a short, catchy, and descriptive tagline (1-2 sentences) that captures the essence of the district.
3.  **attractions:** List 3-5 specific and well-known attractions (e.g., temples, viewpoints, national parks, historical sites).
4.  **accommodations:** List 2-4 general types or examples of accommodations available (e.g., Luxury Hotels, Tea Houses, Community Homestays, Budget Guesthouses).
5.  **activities:** List 3-5 popular activities or notable events specific to the district (e.g., Trekking routes starting here, Rafting rivers, Cultural tours, Major local festivals with approximate timing if known).
6.  **food:** List 2-4 famous local dishes, food specialties, or types of cuisine prominent in the district.

Present the output strictly as a JSON object matching the defined output schema. Be concise and accurate. Focus on the most relevant and appealing information for a tourist.
`,
});

const getDistrictDetailsFlow = ai.defineFlow(
  {
    name: 'getDistrictDetailsFlow',
    inputSchema: GetDistrictDetailsInputSchema,
    outputSchema: GetDistrictDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure the name matches the input, sometimes the LLM might slightly alter it.
    if (output) {
       output.name = input.districtName;
    }
    return output!;
  }
);
