import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      initials: "VT",
      name: "Vikram T.",
      role: "Founder & CEO",
      quote: "I used to wake up wondering what compliance deadline I'd forgotten. Now I check one dashboard, see green across the board, and get on with my day. That background anxiety? Gone."
    },
    {
      initials: "PM",
      name: "Priya M.",
      role: "Co-founder & CFO",
      quote: "We had five WhatsApp groups for compliance. Five. Now there's one place I check. When something needs attention, I click 'Get Help' and it's handled. No explaining, no forwarding emails."
    },
    {
      initials: "SK",
      name: "Sanjay K.",
      role: "VP Finance",
      quote: "We scaled from 2 to 5 entities in a year. Without Vimtara's automated ROC and GST syncing, we would have needed a massive team just to manage the paperwork. Our CA loves the direct access, too."
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useGSAP(() => {
    // Initial Section Entrance
    gsap.fromTo(".test-header",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } }
    );

    gsap.fromTo(".slider-controls",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out(1.5)", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } }
    );
  }, { scope: containerRef });

  // Handle the Slider Track Animation
  useGSAP(() => {
    gsap.to(trackRef.current, {
      xPercent: -100 * currentIndex,
      duration: 0.8,
      ease: "power3.inOut"
    });

    // Subtly scale and fade the active card for a 3D focus effect
    cardsRef.current.forEach((card, index) => {
      gsap.to(card, {
        scale: index === currentIndex ? 1 : 0.9,
        opacity: index === currentIndex ? 1 : 0.4,
        duration: 0.8,
        ease: "power3.inOut"
      });
    });
  }, [currentIndex]);

  return (
    <section ref={containerRef} className="bg-white py-24 lg:py-32 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="test-header text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">Hear From Our Clients</h2>
          <h3 className="test-header text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight">
            Real <span className="text-blue-600">Stories</span>, Real <span className="text-blue-600">Results</span>
          </h3>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Slider Track Container */}
          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] bg-white border border-slate-100">
            <div ref={trackRef} className="flex flex-row w-full will-change-transform">
              
              {testimonials.map((test, index) => (
                <div key={index} className="w-full flex-shrink-0 flex flex-col md:flex-row">
                  
                  {/* Left Side: Dark Theme Avatar */}
                  <div className="w-full md:w-2/5 bg-[#0b1221] relative flex items-center justify-center p-12 overflow-hidden">
                    {/* Abstract Dark Glows */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px]"></div>
                    
                    {/* Avatar Circle */}
                    <div ref={el => cardsRef.current[index] = el} className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10">
                      <span className="text-3xl font-black text-white tracking-wider">{test.initials}</span>
                    </div>
                  </div>

                  {/* Right Side: Light Theme Quote */}
                  <div className="w-full md:w-3/5 bg-white p-10 lg:p-16 flex flex-col justify-center relative">
                    <Quote className="absolute top-10 left-10 text-slate-100 w-24 h-24 rotate-180 -z-0" />
                    
                    <div className="relative z-10">
                      <p className="text-slate-700 text-xl lg:text-2xl font-semibold leading-relaxed mb-10">
                        "{test.quote}"
                      </p>
                      <div>
                        <div className="font-bold text-slate-900 text-lg">{test.name}</div>
                        <div className="text-slate-500 text-sm">{test.role}</div>
                      </div>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="slider-controls absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-16 z-20">
            <button 
              onClick={handlePrev} 
              className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="slider-controls absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-16 z-20">
            <button 
              onClick={handleNext} 
              className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>

        </div>

        {/* Dots Pagination Indicator */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx 
                  ? 'w-8 h-2.5 bg-blue-600' 
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}