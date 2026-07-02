import { useRef } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLocation } from 'react-router-dom'; // 1. Import useLocation

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);
  const location = useLocation(); // 2. Track the current URL path

  useGSAP(() => {
    // Force GSAP to recalculate page heights when navigating between pages
    ScrollTrigger.refresh();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%", 
      }
    });

    tl.fromTo(".footer-col", 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    )
    .fromTo(".footer-bottom", 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=0.4"
    );
    
  // 3. Add location.pathname as a dependency so this re-runs on route change
  }, { scope: containerRef, dependencies: [location.pathname] }); 

  return (
    <footer ref={containerRef} className="bg-[#05080f] pt-20 pb-8 relative overflow-hidden border-t border-slate-800/50">
      
      {/* Subtle Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="footer-col lg:col-span-4 pr-0 lg:pr-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl italic tracking-tighter">
                V
              </div>
              <span className="text-xl font-bold text-white tracking-widest uppercase">
                Imtara
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              India's premier AI-powered compliance command center. We transform fragmented statutory obligations into a seamless, automated, and risk-free operation.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-col lg:col-span-3">
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Platform</h4>
            <ul className="space-y-4">
              {['AI Statutory Compliance', 'Statutory Compliance Software', 'Pricing', 'How It Works'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-3"></span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-col lg:col-span-2">
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Concierge Services', 'Insights & Blog', 'Contact Sales'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-3"></span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col lg:col-span-3">
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Stay Compliant</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Get the latest regulatory updates and compliance strategies delivered directly to your inbox.
            </p>
            <div className="flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-700 text-white text-sm px-4 py-2.5 rounded-l-lg w-full focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-lg border border-blue-600 transition-colors flex items-center justify-center">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="footer-bottom pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <div className="text-slate-500 text-xs">
              © 2026 Vimtara Seamless Services LLP. All rights reserved.
            </div>
            <div className="text-slate-600 text-[10px]">
              Disclaimer: Vimtara is an independent statutory compliance service provider, not a government entity.
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Use</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}