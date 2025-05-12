
'use server';

/**
 * @fileOverview An AI-powered itinerary planning tool.
 *
 * - aiItineraryTool - A function that generates or modifies a travel itinerary based on user preferences.
 * - AiItineraryToolInput - The input type for the aiItineraryTool function.
 * - AiItineraryToolOutput - The return type for the aiItineraryTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { budgetRanges } from '@/types'; // Import budgetRanges

// Define the budget range keys for the enum
const budgetKeys = Object.keys(budgetRanges) as [keyof typeof budgetRanges, ...(keyof typeof budgetRanges)[]];


// Output schema needs to be defined before input schema if it's referenced
const AiItineraryToolOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      location: z.string().describe('The location for the day.'),
      activities: z.array(z.string()).describe('A list of specific activities planned for the day (bullet points).'),
      hotelRecommendations: z.array(z.string()).optional().describe('Optional: 2-3 specific hotel recommendations for this location if staying overnight.'),
    })
  ).describe('The generated travel itinerary with daily schedule.'),
});
export type AiItineraryToolOutput = z.infer<typeof AiItineraryToolOutputSchema>;


const AiItineraryToolInputSchema = z.object({
  itineraryType: z.enum(['custom', 'random']).describe('The type of itinerary requested: custom or random.'),
  interests: z
    .string()
    .optional()
    .describe('The users interests for the trip (required for custom type), e.g. culture, nature, adventure.'),
  duration: z.number().min(1).describe('The duration of the trip in days (no maximum limit).'), // Updated description
  budget: z.string().describe('The budget range for the total trip, e.g., "< $500 USD", "$500 - $1000 USD", "$1000 - $2000 USD", "$2000 - $3000 USD", "> $3000 USD".'),
  startPoint: z.string().describe('The start point of the trip, e.g. Kathmandu, Pokhara.'),
  endPoint: z
    .string()
    .optional()
    .describe('The desired end point of the trip (optional). If not provided for Random Adventure, it will be the same as the start point.'), // Updated description
  mustVisitPlaces: z
    .string()
    .optional()
    .describe('Specific places or regions the user must visit (optional, for custom type).'),
  previousItinerary: AiItineraryToolOutputSchema.optional().describe('The previously generated itinerary if this is a modification request. This is the full output object including the "itinerary" array.'),
  modificationRequest: z.string().optional().describe("The user's textual request to modify the previous itinerary (e.g., 'Add an extra day in Pokhara', 'Remove the visit to X')."),
});
export type AiItineraryToolInput = z.infer<typeof AiItineraryToolInputSchema>;


export async function aiItineraryTool(input: AiItineraryToolInput): Promise<AiItineraryToolOutput> {
  // Basic validation: Ensure interests are provided for custom type if not modifying
  if (!input.previousItinerary && input.itineraryType === 'custom' && (!input.interests || input.interests.length < 10)) {
      throw new Error("Interests (min 10 characters) are required for a custom itinerary.");
  }
  // Validate budget is one of the allowed labels (derived from budgetRanges)
  if (!Object.values(budgetRanges).includes(input.budget)) {
       throw new Error("Invalid budget range provided.");
  }
  // Ensure duration is at least 1
  if (input.duration < 1) {
        throw new Error("Duration must be at least 1 day.");
  }


  return aiItineraryToolFlow(input);
}

// Define a schema for the prompt's input, including the derived `isCustom` flag.
// Note: This schema is internal to the prompt definition and flow call.
const PromptInputSchema = AiItineraryToolInputSchema.extend({
    isCustom: z.boolean().optional().describe("Internal flag indicating if the type is 'custom'."),
});


const prompt = ai.definePrompt({
  name: 'aiItineraryToolPrompt',
  input: {schema: PromptInputSchema}, // Use the extended schema for the prompt
  output: {schema: AiItineraryToolOutputSchema},
  prompt: `You are a creative and knowledgeable travel expert specializing in crafting exciting itineraries for Nepal.
Generate or modify a detailed day-by-day travel plan based on the user's request. The trip duration can be any number of days, there is no maximum limit.

**CRITICAL INSTRUCTIONS (Apply to all itineraries):**
1.  **Expand Beyond the Usual:** While Kathmandu, Pokhara, and Chitwan are popular, actively suggest *at least one or two different locations* if the duration allows (e.g., 5+ days) or if user interests suggest it (e.g., 'trekking' might imply Solukhumbu or Annapurna regions, 'culture' might imply Lumbini, Janakpur, or Panauti). Create a logical route incorporating these diverse locations. For **longer durations (e.g., 15+ days)**, aim to include locations from *different regions* of Nepal (East, Central, West) if travel is feasible within the timeframe and aligns with user interests/budget. Show the vastness and diversity of Nepal.
2.  **List activities as bullet points:** For the 'activities' field, provide a JSON array of strings, where each string is a distinct activity or step for the day. DO NOT provide a single paragraph.
3.  **Hotel Recommendations:** If the plan for the day involves staying overnight in a location (especially in cities or major towns), provide 2-3 *specific*, *realistic* hotel names in the 'hotelRecommendations' field (as a JSON array of strings). Mention the hotel name and a brief category if possible (e.g., "Hotel Yak & Yeti (Luxury)", "Thamel Eco Resort (Mid-Range)", "Zostel Kathmandu (Budget/Hostel)"). If it's a trekking day staying in a tea house, you can omit specific recommendations or just mention "Stay at a local tea house". Only include recommendations if an overnight stay is implied for that day's location.
4.  **Budget Alignment:** Ensure suggested activities and hotels generally align with the overall trip budget range provided by the user. For example, don't suggest primarily luxury hotels for a "< $500 USD" budget.
5.  **Respect Must-Visit (Custom Only):** If the user specifies 'mustVisitPlaces' (for custom itineraries), ensure these are included logically within the itinerary.
6.  **Maintain Overall Context (Modifications):** When modifying, try to keep the original duration and budget unless the modification request explicitly asks to change them. The modified itinerary should still make sense as a whole.
7.  **Route Diversity:** For all itineraries, especially random ones, aim to create routes that avoid excessive backtracking or repetition of locations unless it's logically necessary (e.g., passing through a hub) or explicitly requested by the user in a modification. Showcase a variety of experiences and places.
8.  **End Point Handling:**
    *   **Custom:** If an endPoint is provided, the itinerary should conclude there. If not, it can end anywhere logical based on the route.
    *   **Random:** If an endPoint is provided and it's different from startPoint, the itinerary should conclude at the specified endPoint. If no endPoint is provided, the itinerary MUST end back at the startPoint.

{{#if previousItinerary}}
**MODIFICATION TASK**

You previously generated this itinerary for the user:
\`\`\`json
{{{json previousItinerary.itinerary}}}
\`\`\`

The user's original preferences for this itinerary were:
*   Itinerary Type: {{itineraryType}}
{{#if interests}}*   Interests: {{{interests}}}{{/if}}
*   Duration: {{duration}} days
*   Budget Range (Total Trip): {{budget}}
*   Start Point: {{startPoint}}
{{#if endPoint}}*   End Point: {{endPoint}}{{/if}}
{{#if mustVisitPlaces}}*   Must-Visit Places: {{mustVisitPlaces}}{{/if}}

Now, the user has the following modification request:
**Modification Request: "{{{modificationRequest}}}"**

Please carefully review the previous itinerary and the modification request. Update the itinerary based on this request.
*   Adhere to all CRITICAL INSTRUCTIONS mentioned above, including End Point Handling for the original itinerary type.
*   The output MUST be the complete revised itinerary in the specified JSON format.
*   If a request is impossible or significantly compromises the itinerary (e.g., makes it too rushed, exceeds budget drastically without acknowledgement), try your best to accommodate the spirit of the request, or clearly state in an activity for the relevant day why it's not feasible and offer a brief alternative if possible, then continue with the rest of the itinerary. However, prioritize fulfilling the request if it's reasonable.
*   Ensure the day numbers are sequential and correct in the modified itinerary.

{{else}}
**NEW ITINERARY GENERATION TASK**

{{#if isCustom}}
**Itinerary Type:** Custom Plan

**User Preferences:**
*   Interests: {{{interests}}}
*   Duration: {{{duration}}} days (Note: No maximum limit on duration)
*   Budget Range (Total Trip): {{{budget}}}
*   Start Point: {{{startPoint}}}
{{#if endPoint}}*   End Point: {{{endPoint}}}{{/if}}
{{#if mustVisitPlaces}}*   Must-Visit Places/Regions: {{{mustVisitPlaces}}}{{/if}}

Generate a personalized itinerary considering all these preferences. Ensure the plan flows logically, incorporates the must-visit locations if provided, and includes diverse locations beyond just Kathmandu/Pokhara/Chitwan as appropriate (see critical instruction #1). For longer durations, try to cover more ground across different regions. Pay attention to the specified end point if provided (Critical Instruction #8). Follow the other critical instructions above, paying close attention to budget and route diversity.

{{else}}
**Itinerary Type:** Random Adventure

**User Preferences:**
*   Duration: {{{duration}}} days (Note: No maximum limit on duration)
*   Budget Range (Total Trip): {{{budget}}}
*   Start Point: {{{startPoint}}}
{{#if endPoint}}*   **Requested End Point:** {{{endPoint}}} {{else}}*   **Important:** No specific end point requested. The itinerary MUST end back at the starting point: {{{startPoint}}}.{{/if}}

Generate a plausible and exciting random itinerary starting from {{startPoint}} for {{duration}} days, suitable for the specified total trip budget range: {{budget}}.
*   **End Point Handling:** Adhere to Critical Instruction #8. If an endPoint is provided, conclude there. Otherwise, the trip must conclude at the **startPoint ({{{startPoint}}})**.
*   Focus on a balanced mix of popular highlights BUT **actively include at least one or two lesser-known or different regions** accessible from the route to make it a true adventure (see critical instruction #1).
*   For longer durations, aim for wider exploration across Nepal, always ensuring the correct end point based on the user's request.
*   **Prioritize route diversity (Critical Instruction #7):** Avoid unnecessary repetition of locations or backtracking. Create a varied and interesting journey.
*   Follow all other critical instructions above, ensuring suggestions align with the overall budget.
{{/if}}
{{/if}}

**Output Format (MANDATORY for both new and modified itineraries):**
Provide the output as a JSON object with a single key "itinerary". The value of "itinerary" must be a JSON array of objects. Each object in the array must represent a day and contain 'day' (number), 'location' (string), 'activities' (array of strings), and optionally 'hotelRecommendations' (array of strings). DO NOT include an 'estimatedDailyCost' field.

Example for one day in the "itinerary" array:
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
    inputSchema: AiItineraryToolInputSchema, // Flow function still uses the original input schema
    outputSchema: AiItineraryToolOutputSchema,
  },
  async input => {
    let processedInput = { ...input };
    const isCustom = input.itineraryType === 'custom'; // Determine if it's custom

    // General processing for optional fields and 'none'/'empty' values
    processedInput.endPoint = input.endPoint === "none" || input.endPoint === "" ? undefined : input.endPoint;
    processedInput.mustVisitPlaces = input.mustVisitPlaces === "none" || input.mustVisitPlaces === "" ? undefined : input.mustVisitPlaces;
    processedInput.interests = input.interests || undefined;

    // Specific processing for NEW itineraries (not modifications)
    if (!input.previousItinerary) {
        if (!isCustom) { // If it's random
            // For new random itineraries, ensure interests and mustVisitPlaces are undefined
            processedInput.interests = undefined;
            processedInput.mustVisitPlaces = undefined;
            // End point is handled by the prompt based on whether it's provided or not. No need to force it here.
        } else { // If it's custom
            // Nothing specific needed here anymore, general processing handles optional fields.
        }
    }

    // Ensure modification related fields are undefined if not a modification
    processedInput.previousItinerary = input.previousItinerary || undefined;
    processedInput.modificationRequest = input.modificationRequest || undefined;

    // Call the prompt with the processed input AND the derived boolean flag
    const {output} = await prompt({
        ...processedInput,
        isCustom: isCustom, // Add the boolean flag here
    });
    return output!;
  }
);

