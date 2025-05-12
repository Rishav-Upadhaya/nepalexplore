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
  interests: z
    .string()
    .describe('The users interests for the trip, e.g. culture, nature, adventure.'),
  duration: z.number().describe('The duration of the trip in days.'),
  budget: z.string().describe('The budget for the trip, e.g. low, medium, high.'),
  startPoint: z.string().describe('The start point of the trip, e.g. Kathmandu, Pokhara.'),
});
export type AiItineraryToolInput = z.infer<typeof AiItineraryToolInputSchema>;

const AiItineraryToolOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      location: z.string().describe('The location for the day.'),
      activities: z.string().describe('The activities for the day.'),
    })
  ).describe('The generated travel itinerary with daily schedule.'),
});
export type AiItineraryToolOutput = z.infer<typeof AiItineraryToolOutputSchema>;

export async function aiItineraryTool(input: AiItineraryToolInput): Promise<AiItineraryToolOutput> {
  return aiItineraryToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItineraryToolPrompt',
  input: {schema: AiItineraryToolInputSchema},
  output: {schema: AiItineraryToolOutputSchema},
  prompt: `You are a travel expert specializing in Nepal.

  Based on the user's preferences, generate a detailed travel itinerary with a daily schedule.  Include the day number, location, and activities for each day.

  User Preferences:
  Interests: {{{interests}}}
  Duration: {{{duration}}} days
  Budget: {{{budget}}}
  Start Point: {{{startPoint}}}

  Output should be a JSON array of objects, where each object represents a day in the itinerary. Each object in the array should contain the day, location, and activities for that day.

  Example:
  [
    {
      "day": 1,
      "location": "Kathmandu",
      "activities": "Arrival in Kathmandu, visit Pashupatinath Temple, Boudhanath Stupa"
    },
    {
      "day": 2,
      "location": "Pokhara",
      "activities": "Fly to Pokhara, Phewa Lake boating, visit World Peace Pagoda"
    }
  ]
  `,
});

const aiItineraryToolFlow = ai.defineFlow(
  {
    name: 'aiItineraryToolFlow',
    inputSchema: AiItineraryToolInputSchema,
    outputSchema: AiItineraryToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
