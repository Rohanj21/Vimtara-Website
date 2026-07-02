import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeroSection from '../components/HeroSection';
import PlatformSection from '../components/PlatformSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ConciergeSection from '../components/ConciergeSection';
import TestimonialsSection from '../components/TestimonialsSection';
import InsightsSection from '../components/InsightsSection';
import CtaSection from '../components/CtaSection';

export default function Home() {
  const { hash } = useLocation();

  // Handle smooth scrolling when navigating to this page with a hash in the URL
  useEffect(() => {
    if (hash) {
      // Small timeout ensures GSAP has time to render the DOM before calculating scroll position
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <main>
      <HeroSection />
      
      {/* Added IDs for Anchor Routing */}
      <div id="platform"><PlatformSection /></div>
      <div id="how-it-works"><HowItWorksSection /></div>
      
      
      <div id="concierge"><ConciergeSection /></div>
      <TestimonialsSection />
      <div id="insights"><InsightsSection /></div>
      
      <CtaSection />
    </main>
  );
}