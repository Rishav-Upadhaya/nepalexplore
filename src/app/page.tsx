import { Hero } from '@/components/home/Hero';
import { WhyNepal } from '@/components/home/WhyNepal';
import { DiscoverDistrictsSection } from '@/components/home/DiscoverDistrictsSection';
import { SustainabilitySection } from '@/components/home/SustainabilitySection'; // Import the new section

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyNepal />
      <DiscoverDistrictsSection />
      <SustainabilitySection /> {/* Add the sustainability section */}
    </>
  );
}
