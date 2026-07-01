import { useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const containerRef = useRef(null);

  const benefits = [
    "One dashboard across all your systems.",
    "One click to resolve any issue.",
    "Your CA already inside the platform.",
    "Expert partners when you want hands-off management."
  ];

  useGSAP(() => {
    // 1. Cinematic Entrance Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo(".cta-badge", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      )
      .fromTo(".cta-title", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
        "-=0.4"
      )
      .fromTo(".cta-benefit", 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 
        "-=0.4"
      )
      .fromTo(".cta-onboarding", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8 }, 
        "-=0.2"
      )
      .fromTo(".cta-actions", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 
        "-=0.4"
      )
      .fromTo(".cta-footer", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1 }, 
        "-=0.2"
      );

    // 2. Continuous Ambient Breathing Effect for Background Glows
    gsap.to(".ambient-glow", {
      scale: 1.15,
      opacity: 0.6,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 1.5 // offsets the breathing so they don't pulse at the exact same time
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#0b1121] py-32 overflow-hidden border-t border-white/5">
      
      {/* Deep Ambient Background Glows */}
      <div className="ambient-glow absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="ambient-glow absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Pre-Header */}
        <div className="cta-badge text-blue-500 font-bold uppercase tracking-widest text-xs mb-6">
          Get Started
        </div>

        {/* Main Headline */}
        <h2 className="cta-title text-5xl lg:text-6xl font-extrabold text-white mb-10 tracking-tight leading-[1.15]">
          India's Statutory Compliance,<br />
          <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">Always Under Control.</span>
        </h2>

        {/* Benefits List */}
        <div className="flex flex-col gap-3 mb-12">
          {benefits.map((text, idx) => (
            <div key={idx} className="cta-benefit flex items-center justify-center gap-3 text-slate-300 text-lg">
              <CheckCircle2 size={18} className="text-emerald-400 opacity-80" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Assurance Text */}
        <p className="cta-onboarding text-white font-bold text-lg mb-10">
          Our team will guide you end-to-end through a seamless onboarding experience.
        </p>

        {/* Action Buttons */}
        <div className="cta-actions flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group">
            Get Your Compliance Dashboard 
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-white/5 text-slate-200 font-bold rounded-xl transition-all duration-300 flex items-center justify-center">
            Contact Us
          </button>
        </div>

        {/* Footer / Social Proof */}
        <div className="cta-footer text-xs font-medium text-slate-500 tracking-wide flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Trusted by companies across</span>
          <span className="text-slate-300">Mumbai</span> <span className="opacity-50">•</span>
          <span className="text-slate-300">Delhi</span> <span className="opacity-50">•</span>
          <span className="text-slate-300">Bangalore</span> <span className="opacity-50">•</span>
          <span className="text-slate-300">Pune</span> <span className="opacity-50">•</span>
          <span className="text-slate-300">Chennai</span> <span className="opacity-50">•</span>
          <span className="text-slate-300">Hyderabad</span>
        </div>

      </div>
    </section>
  );
}