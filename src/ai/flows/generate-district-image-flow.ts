'use server';
/**
 * @fileOverview Generates an image representing a Nepalese district using AI.
 *
 * - generateDistrictImage - A function that generates an image for a district.
 * - GenerateDistrictImageInput - The input type for the generateDistrictImage function.
 * - GenerateDistrictImageOutput - The return type for the generateDistrictImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDistrictImageInputSchema = z.object({
  districtName: z.string().describe('The name of the Nepalese district to generate an image for.'),
});
export type GenerateDistrictImageInput = z.infer<typeof GenerateDistrictImageInputSchema>;

const GenerateDistrictImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image. Expected format: \'data:image/png;base64,<encoded_data>\'.'),
});
export type GenerateDistrictImageOutput = z.infer<typeof GenerateDistrictImageOutputSchema>;

export async function generateDistrictImage(
  input: GenerateDistrictImageInput
): Promise<GenerateDistrictImageOutput> {
  return generateDistrictImageFlow(input);
}


const generateDistrictImageFlow = ai.defineFlow(
  {
    name: 'generateDistrictImageFlow',
    inputSchema: GenerateDistrictImageInputSchema,
    outputSchema: GenerateDistrictImageOutputSchema,
  },
  async input => {
    console.log(`Generating image for district: ${input.districtName}`);
    try {
        const { media } = await ai.generate({
            // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
            model: 'googleai/gemini-2.0-flash-exp',

            // Simple prompt instructing the model to generate an image representative of the district
            prompt: `Generate a realistic and appealing image representing the landscape or a famous landmark of the ${input.districtName} district in Nepal. Focus on natural beauty or cultural significance. Avoid text overlays on the image.`,

            config: {
                responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
                // Optional: Adjust safety settings if needed, otherwise default settings apply
                // safetySettings: [
                //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
                // ],
            },
        });

        if (!media?.url) {
            throw new Error('Image generation failed, no media URL returned.');
        }

        console.log(`Image generated successfully for ${input.districtName}`);
        return { imageUrl: media.url }; // media.url is the data URI

    } catch (error) {
         console.error(`Error generating image for ${input.districtName}:`, error);
         // Rethrow or handle the error appropriately
         // For now, rethrowing to let the caller handle it
         throw new Error(`Failed to generate image for ${input.districtName}. Reason: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
