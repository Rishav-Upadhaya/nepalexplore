
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
import { budgetRanges } from '@/types'; // Import budgetRanges

// Define the budget range keys for the enum
const budgetKeys = Object.keys(budgetRanges) as [keyof typeof budgetRanges, ...(keyof typeof budgetRanges)[]];

const AiItineraryToolInputSchema = z.object({
  itineraryType: z.enum(['custom', 'random']).describe('The type of itinerary requested: custom or random.'),
  interests: z
    .string()
    .optional()
    .describe('The users interests for the trip (required for custom type), e.g. culture, nature, adventure.'),
  duration: z.number().describe('The duration of the trip in days.'),
  // Updated budget to accept the display label string (e.g., "$500 - $1000 USD")
  budget: z.string().describe('The budget range for the total trip, e.g., "< $500 USD", "$500 - $1000 USD", "$1000 - $2000 USD", "$2000 - $3000 USD", "> $3000 USD".'),
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

// Updated Output Schema to remove estimatedDailyCost
const AiItineraryToolOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      location: z.string().describe('The location for the day.'),
      activities: z.array(z.string()).describe('A list of specific activities planned for the day (bullet points).'),
      hotelRecommendations: z.array(z.string()).optional().describe('Optional: 2-3 specific hotel recommendations for this location if staying overnight.'),
      // REMOVED: estimatedDailyCost field
    })
  ).describe('The generated travel itinerary with daily schedule.'),
});
export type AiItineraryToolOutput = z.infer<typeof AiItineraryToolOutputSchema>;

export async function aiItineraryTool(input: AiItineraryToolInput): Promise<AiItineraryToolOutput> {
  // Basic validation: Ensure interests are provided for custom type
  if (input.itineraryType === 'custom' && (!input.interests || input.interests.length < 10)) {
      throw new Error("Interests (min 10 characters) are required for a custom itinerary.");
  }
  // Validate budget is one of the allowed labels (derived from budgetRanges)
  if (!Object.values(budgetRanges).includes(input.budget)) {
       throw new Error("Invalid budget range provided.");
  }

  return aiItineraryToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiItineraryToolPrompt',
  input: {schema: AiItineraryToolInputSchema},
  output: {schema: AiItineraryToolOutputSchema},
  prompt: `You are a creative and knowledgeable travel expert specializing in crafting exciting itineraries for Nepal. Generate a detailed day-by-day travel plan based on the user's request.

**CRITICAL INSTRUCTIONS:**
1.  **Expand Beyond the Usual:** While Kathmandu, Pokhara, and Chitwan are popular, actively suggest *at least one or two different locations* if the duration allows (e.g., 5+ days) or if user interests suggest it (e.g., 'trekking' might imply Solukhumbu or Annapurna regions, 'culture' might imply Lumbini, Janakpur, or Panauti). Create a logical route incorporating these diverse locations.
2.  **List activities as bullet points:** For the 'activities' field, provide a JSON array of strings, where each string is a distinct activity or step for the day. DO NOT provide a single paragraph.
3.  **Hotel Recommendations:** If the plan for the day involves staying overnight in a location (especially in cities or major towns), provide 2-3 *specific*, *realistic* hotel names in the 'hotelRecommendations' field (as a JSON array of strings). Mention the hotel name and a brief category if possible (e.g., "Hotel Yak & Yeti (Luxury)", "Thamel Eco Resort (Mid-Range)", "Zostel Kathmandu (Budget/Hostel)"). If it's a trekking day staying in a tea house, you can omit specific recommendations or just mention "Stay at a local tea house". Only include recommendations if an overnight stay is implied for that day's location.
4.  **Budget Alignment:** Ensure suggested activities and hotels generally align with the overall trip budget range provided by the user. For example, don't suggest primarily luxury hotels for a "< $500 USD" budget.
5.  **Respect Must-Visit:** If the user specifies 'mustVisitPlaces', ensure these are included logically within the itinerary.

{{#if interests}}
**Itinerary Type:** Custom Plan

**User Preferences:**
*   Interests: {{{interests}}}
*   Duration: {{{duration}}} days
*   Budget Range (Total Trip): {{{budget}}}
*   Start Point: {{{startPoint}}}
{{#if endPoint}}*   End Point: {{{endPoint}}}{{/if}}
{{#if mustVisitPlaces}}*   Must-Visit Places/Regions: {{{mustVisitPlaces}}}{{/if}}

Generate a personalized itinerary considering all these preferences. Ensure the plan flows logically, incorporates the must-visit locations if provided, and includes diverse locations beyond just Kathmandu/Pokhara/Chitwan as appropriate (see critical instruction #1). Follow the other critical instructions above, paying close attention to budget.

{{else}}
**Itinerary Type:** Random Adventure

**User Preferences:**
*   Duration: {{{duration}}} days
*   Budget Range (Total Trip): {{{budget}}}
*   Start Point: {{{startPoint}}}

Generate a plausible and exciting random itinerary starting from {{startPoint}} for {{duration}} days, suitable for the specified total trip budget range: {{budget}}. Focus on a balanced mix of popular highlights BUT **actively include at least one or two lesser-known or different regions** accessible from the route to make it a true adventure (see critical instruction #1). Follow the other critical instructions above, ensuring suggestions align with the overall budget.
{{/if}}

**Output Format:**
Provide the output as a JSON array of objects. Each object must represent a day and contain 'day' (number), 'location' (string), 'activities' (array of strings), and optionally 'hotelRecommendations' (array of strings). DO NOT include an 'estimatedDailyCost' field.

Example for one day:
{
  "day": 3,
  "location": "Bandipur",
  "activities": [
    "Travel from Pokhara to the charming hilltop town of Bandipur.",
    "Explore the preserved Newari architecture and traffic-free main street.",
    "Enjoy panoramic sunset views over the Himalayas.",
    "Experience a traditional Newari dinner."
  ],
  "hotelRecommendations": [
     "The Old Inn (Heritage/Mid-Range)",
     "Gaun Ghar (Boutique/Mid-Range)",
     "Bandipur Mountain Resort (Budget/Standard)"
  ]
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
     // Ensure optional fields are passed correctly or as undefined if empty/null
    const processedInput = {
      ...input,
      endPoint: input.endPoint || undefined,
      mustVisitPlaces: input.mustVisitPlaces || undefined,
      interests: input.interests || undefined, // Pass interests even if empty for the #if logic in handlebars
    };
    const {output} = await prompt(processedInput);
    // No post-processing needed for estimatedDailyCost anymore
    return output!;
  }
);

