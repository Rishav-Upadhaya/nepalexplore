import { ItineraryPlanner } from '@/components/itinerary-planner/ItineraryPlanner';
import type { Metadata } from 'next';

// Static metadata for the Plan Trip page
export const metadata: Metadata = {
  title: 'AI Itinerary Planner | Plan Your Nepal Trip',
  description: 'Use our AI-powered tool to create custom or random travel itineraries for your Nepal visit. Plan your tour duration, budget, and interests easily.',
  keywords: ['Nepal Itinerary Planner', 'Plan Nepal Trip', 'AI Travel Planner', 'Nepal Tour Plan', 'Custom Nepal Itinerary', 'Random Nepal Itinerary', 'Travel AI'],
   openGraph: {
      title: 'AI Itinerary Planner | Plan Your Nepal Trip',
      description: 'Create custom or random travel itineraries for your Nepal visit with AI.',
    },
     twitter: {
        title: 'AI Itinerary Planner | Plan Your Nepal Trip',
        description: 'Create custom or random travel itineraries for your Nepal visit with AI.',
    }
};

export default function PlanTripPage() {
  return <ItineraryPlanner />;
}
