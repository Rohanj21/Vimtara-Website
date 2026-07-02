import HeroSection from '../components/HeroSection';
import PlatformSection from '../components/PlatformSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ConciergeSection from '../components/ConciergeSection';
import TestimonialsSection from '../components/TestimonialsSection';
import InsightsSection from '../components/InsightsSection';
import CtaSection from '../components/CtaSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PlatformSection />
      <HowItWorksSection />
      <ConciergeSection />
      <TestimonialsSection />
      <InsightsSection />
      <CtaSection />
    </main>
  );
}