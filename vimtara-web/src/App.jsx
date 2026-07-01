import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlatformSection from './components/PlatformSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSplitSection from './components/FeaturesSplitSection';
import ConciergeSection from './components/ConciergeSection';
import TestimonialsSection from './components/TestimonialsSection';
import InsightsSection from './components/InsightsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer'; // Import

export default function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PlatformSection />
      <HowItWorksSection />
      <FeaturesSplitSection />
      <ConciergeSection />
      <TestimonialsSection />
      <InsightsSection />
      <CtaSection />
      <Footer />
    </>
  );
}