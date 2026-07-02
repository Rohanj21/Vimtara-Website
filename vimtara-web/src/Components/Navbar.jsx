import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen for scroll events to trigger the detach effect
  useEffect(() => {
    const handleScroll = () => {
      // Toggle state when scrolled down more than 20 pixels
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed left-0 right-0 z-50 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between px-6 lg:px-8
        ${isScrolled
          ? 'top-4 h-16 w-[95%] max-w-7xl bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 rounded-full'
          : 'top-8 h-20 w-[95%] max-w-7xl bg-white/5 backdrop-blur-md border border-white/10 rounded-full'
        }`}
    >
      {/* Logo Area - Converted to React Router Link */}
      <Link to="/" className="flex items-center gap-1 cursor-pointer">
        <span className="text-blue-600 text-3xl font-black leading-none -mt-1">V</span>
        <span className={`uppercase tracking-widest text-lg font-black ml-1 transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
          imtara
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden lg:flex items-center gap-8">
        {['Solutions', 'Platform', 'Concierge', 'Pricing', 'How It Works', 'Insights', 'Contact'].map((item) => (
          item === 'Pricing' ? (
            /* Pricing Item - Converted to React Router Link */
            <Link 
              key={item} 
              to="/pricing"
              className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1
                ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
            >
              {item}
            </Link>
          ) : (
            /* Standard Button for all other items */
            <button 
              key={item} 
              className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1
                ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
            >
              {item} {item === 'Solutions' && <ChevronDown size={14} className="mt-0.5" />}
            </button>
          )
        ))}
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