import { config } from 'dotenv';
config();

import '@/ai/flows/hidden-gems-suggestions.ts';
import '@/ai/flows/ai-itinerary-tool.ts';
import '@/ai/flows/virtual-postcards.ts';
import '@/ai/flows/get-district-details-flow.ts';
import '@/ai/flows/generate-district-image-flow.ts'; // Added import for the new image generation flow

