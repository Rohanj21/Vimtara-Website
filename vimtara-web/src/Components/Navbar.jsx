import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const menuContainerRef = useRef(null);
  const dropdownItemsRef = useRef([]);

  // Solutions Dropdown Data
  const solutionsMenu = [
    {
      title: "Statutory Compliance Software",
      desc: "Master MCA, GST, and ROC filings with zero missed deadlines.",
      path: "/solutions/statutory-compliance",
      icon: ShieldCheck
    },
    {
      title: "AI Statutory Compliance",
      desc: "Predictive AI for real-time compliance health and risk mitigation.",
      path: "/solutions/ai-statutory-compliance",
      icon: Sparkles
    },
    {
      title: "Agentic AI for Business Operations",
      desc: "Autonomous agents to handle your routine compliance operations.",
      path: "/solutions/agentic-ai",
      icon: Cpu
    }
  ];

  // Listen for scroll events to trigger the detach effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Animation for the Dropdown
  useGSAP(() => {
    if (isSolutionsOpen) {
      // Reveal container
      gsap.to(dropdownRef.current, { 
        autoAlpha: 1, 
        y: 0, 
        duration: 0.4, 
        ease: 'power3.out',
        display: 'block'
      });
      // Stagger in the items
      gsap.fromTo(dropdownItemsRef.current,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      );
    } else {
      // Hide container
      gsap.to(dropdownRef.current, { 
        autoAlpha: 0, 
        y: 10, 
        duration: 0.2, 
        ease: 'power3.in',
        onComplete: () => gsap.set(dropdownRef.current, { display: 'none' })
      });
    }
  }, [isSolutionsOpen]);

  return (
    <nav 
      className={`fixed left-0 right-0 z-50 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between px-6 lg:px-8
        ${isScrolled
          ? 'top-4 h-16 w-[95%] max-w-7xl bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 rounded-full'
          : 'top-8 h-20 w-[95%] max-w-7xl bg-white/5 backdrop-blur-md border border-white/10 rounded-full'
        }`}
    >
      {/* Logo Area */}
      <Link to="/" className="flex items-center gap-1 cursor-pointer">
        <span className="text-blue-600 text-3xl font-black leading-none -mt-1">V</span>
        <span className={`uppercase tracking-widest text-lg font-black ml-1 transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
          imtara
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden lg:flex items-center gap-8 h-full">
        {['Solutions', 'Platform', 'Concierge', 'Pricing', 'How It Works', 'Insights', 'Contact'].map((item) => {
          
          // 1. Solutions Dropdown Item
          if (item === 'Solutions') {
            return (
              <div 
                key={item} 
                className="relative h-full flex items-center"
                onMouseEnter={() => setIsSolutionsOpen(true)}
                onMouseLeave={() => setIsSolutionsOpen(false)}
              >
                <button 
                  className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1
                    ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}
                    ${isSolutionsOpen ? (isScrolled ? 'text-blue-600' : 'text-white') : ''}`}
                >
                  {item} 
                  <ChevronDown 
                    size={14} 
                    className={`mt-0.5 transition-transform duration-300 ${isSolutionsOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Dropdown Wrapper (pt-6 acts as an invisible bridge so hover doesn't break) */}
                <div 
                  ref={dropdownRef}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[400px] opacity-0 invisible hidden"
                  style={{ transform: 'translateX(-50%) translateY(10px)' }}
                >
                  <div 
                    ref={menuContainerRef}
                    className="bg-white rounded-2xl shadow-[0_30px_60px_rgb(0,0,0,0.12)] border border-slate-100 p-3 overflow-hidden flex flex-col gap-1 relative before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-mt-2 before:border-8 before:border-transparent before:border-b-white"
                  >
                    {solutionsMenu.map((menuItem, idx) => (
                      <Link 
                        key={idx}
                        to={menuItem.path}
                        ref={el => dropdownItemsRef.current[idx] = el}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                        onClick={() => setIsSolutionsOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <menuItem.icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {menuItem.title}
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed">
                            {menuItem.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // 2. Direct Link Items (Pricing & Contact)
          if (item === 'Pricing' || item === 'Contact') {
            return (
              <Link 
                key={item} 
                to={item === 'Pricing' ? '/pricing' : '/contact'}
                className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1
                  ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
              >
                {item}
              </Link>
            );
          }

          // 3. Standard Buttons (Platform, Concierge, etc.)
          return (
            <button 
              key={item} 
              className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1
                ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Call to Action Area */}
      <div className="flex items-center gap-6">
        <button 
          className={`text-sm font-semibold hidden sm:block transition-colors duration-300
            ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-400'}`}
        >
          Login
        </button>
        <button className="hidden md:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-600/20 items-center">
          Get Your Dashboard <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </nav>
  );
}