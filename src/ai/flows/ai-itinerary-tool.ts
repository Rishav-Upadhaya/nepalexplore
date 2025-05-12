'use server';

/**
 * @fileOverview An AI-powered itinerary planning tool.
 *
 * - aiItineraryTool - A function that generates a travel itinerary based on user preferences.
 * - AiItineraryToolInput - The input type for the aiItineraryTool function.
 * - AiItineraryToolOutput - The return type for the aiItineraryTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiItineraryToolInputSchema = z.object({
  itineraryType: z.enum(['custom', 'random']).describe('The type of itinerary requested: custom or random.'),
  interests: z
    .string()
    .optional()
    .describe('The users interests for the trip (required for custom type), e.g. culture, nature, adventure.'),
  duration: z.number().describe('The duration of the trip in days.'),
  budget: z.string().describe('The budget for the trip, e.g. low, medium, high.'),
  startPoint: z.string().describe('The start point of the trip, e.g. Kathmandu, Pokhara.'),
  endPoint: z
    .string()
    .optional()
    .describe('The desired end point of the trip (optional, for custom type).'),
  mustVisitPlaces: z
    .string()
    .optional()
    .describe('Specific places or regions the user must visit (optional, for custom type).'),
});
export type AiItineraryToolInput = z.infer<typeof AiItineraryToolInputSchema>;

const AiItineraryToolOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      location: z.string().describe('The location for the day.'),
      activities: z.string().describe('The activities planned for the day, described engagingly.'),
    })
  ).describe('The generated travel itinerary with daily schedule.'),
});
export type AiItineraryToolOutput = z.infer<typeof AiItineraryToolOutputSchema>;

export async function aiItineraryTool(input: AiItineraryToolInput): Promise<AiItineraryToolOutput> {
  // Basic validation: Ensure interests are provided for custom type
  if (input.itineraryType === 'custom' && !input.interests) {
      throw new Error("Interests are required for a custom itinerary.");
  }
  return aiItineraryToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItineraryToolPrompt',
  input: {schema: AiItineraryToolInputSchema},
  output: {schema: AiItineraryToolOutputSchema},
  prompt: `You are a creative and knowledgeable travel expert specializing in crafting exciting itineraries for Nepal. Generate a detailed day-by-day travel plan based on the user's request. Be engaging and descriptive in the activities.

{{#eq itineraryType 'custom'}}
**Itinerary Type:** Custom Plan

**User Preferences:**
*   Interests: {{{interests}}}
*   Duration: {{{duration}}} days
*   Budget: {{{budget}}}
*   Start Point: {{{startPoint}}}
{{#if endPoint}}*   End Point: {{{endPoint}}}{{/if}}
{{#if mustVisitPlaces}}*   Must-Visit Places/Regions: {{{mustVisitPlaces}}}{{/if}}

Generate a personalized itinerary considering all these preferences. Ensure the plan flows logically and incorporates the must-visit locations if provided.

{{else}}
**Itinerary Type:** Random Adventure

**User Preferences:**
*   Duration: {{{duration}}} days
*   Budget: {{{budget}}}
*   Start Point: {{{startPoint}}}

Generate a plausible and exciting random itinerary starting from {{startPoint}} for {{duration}} days, suitable for a {{budget}} budget. Focus on a balanced mix of popular highlights and potentially some interesting lesser-known spots accessible from the route. Make it sound like a fun adventure!
{{/eq}}

**Output Format:**
Provide the output as a JSON array of objects. Each object must represent a day and contain 'day' (number), 'location' (string), and 'activities' (string).

Example for one day:
{
  "day": 3,
  "location": "Chitwan National Park",
  "activities": "Embark on an early morning jeep safari adventure! Keep your eyes peeled for rhinos, deer, and maybe even a Royal Bengal Tiger. Afternoon canoe ride on the Rapti River, spotting crocodiles and diverse birdlife."
}
`,
});


const aiItineraryToolFlow = ai.defineFlow(
  {
    name: 'aiItineraryToolFlow',
    inputSchema: AiItineraryToolInputSchema,
    outputSchema: AiItineraryToolOutputSchema,
  },
  async input => {
     // Ensure optional fields are passed correctly or as undefined if empty
    const processedInput = {
      ...input,
      endPoint: input.endPoint || undefined,
      mustVisitPlaces: input.mustVisitPlaces || undefined,
      interests: input.interests || undefined,
    };
    const {output} = await prompt(processedInput);
    return output!;
  }
);
