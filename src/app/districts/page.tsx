import { DistrictExplorer } from '@/components/districts/DistrictExplorer';
import { nepalDistricts, type DistrictName } from '@/types';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

// Function to generate dynamic metadata based on search params
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const districtName = searchParams.name as DistrictName | undefined;

  let title = 'Explore Nepal\'s 77 Districts | Visit Nepal';
  let description = 'Discover attractions, activities, accommodations, and AI-powered tips for all 77 districts of Nepal. Plan your travel and tour.';
  const keywords = ['Nepal Districts', 'Explore Nepal', 'Nepal Travel', 'Nepal Tourism', '77 Districts', ...nepalDistricts];

  if (districtName && nepalDistricts.includes(districtName)) {
    title = `Explore ${districtName} District | Visit Nepal`;
    description = `Find top attractions, activities, hotels, and travel tips for ${districtName}, Nepal. Plan your tour to ${districtName} with our AI guide.`;
    keywords.push(districtName, `${districtName} travel`, `${districtName} tour`, `${districtName} attractions`);
  }

  // Optionally merge with parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      // images: ['/some-specific-image.jpg', ...previousImages], // Example of adding specific image
    },
     twitter: {
        title,
        description,
        // images: ['/some-specific-twitter-image.jpg'],
    }
  }
}


export default function DistrictExplorerPage() {
  // Pass searchParams to the client component if needed,
  // although DistrictExplorer already uses useSearchParams internally.
  return <DistrictExplorer />;
}
