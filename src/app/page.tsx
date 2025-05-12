import { Hero } from '@/components/home/Hero';
import { WhyNepal } from '@/components/home/WhyNepal';
import { DiscoverDistrictsSection } from '@/components/home/DiscoverDistrictsSection';
import { CtaItineraryPlannerSection } from '@/components/home/CtaItineraryPlannerSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyNepal />
      <DiscoverDistrictsSection />
      <CtaItineraryPlannerSection />
    </>
  );
}
