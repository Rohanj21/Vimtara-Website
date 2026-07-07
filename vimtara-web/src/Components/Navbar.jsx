import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Sparkles, Cpu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  
  // Login Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dropdownRef = useRef(null);
  const menuContainerRef = useRef(null);
  const dropdownItemsRef = useRef([]);
  const timeoutRef = useRef(null); 

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const solutionsMenu = [
    { title: "Statutory Compliance Software", desc: "Master MCA, GST, and ROC filings with zero missed deadlines.", path: "/solutions/statutory-compliance", icon: ShieldCheck },
    { title: "AI Statutory Compliance", desc: "Predictive AI for real-time compliance health and risk mitigation.", path: "/solutions/ai-statutory-compliance", icon: Sparkles },
    { title: "Agentic AI for Business Operations", desc: "Autonomous agents to handle your routine compliance operations.", path: "/solutions/agentic-ai", icon: Cpu }
  ];

  const anchorLinks = {
    'Platform': 'platform',
    'Concierge': 'concierge',
    'How It Works': 'how-it-works',
    'Insights': 'insights'
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (isSolutionsOpen) {
      gsap.to(dropdownRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out', display: 'block', overwrite: 'auto' });
      gsap.fromTo(dropdownItemsRef.current, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.to(dropdownRef.current, { autoAlpha: 0, y: 10, duration: 0.2, ease: 'power3.in', overwrite: 'auto', onComplete: () => gsap.set(dropdownRef.current, { display: 'none' }) });
    }
  }, [isSolutionsOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSolutionsOpen(false);
    }, 150);
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Send the email and password to our Node.js server
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success! Save the secure JWT token to the browser's local storage
        localStorage.setItem('token', data.token);
        
        // 3. Dispatch the REAL user data from PostgreSQL into Redux
        dispatch(login(data.user));
        
        // 4. Clean up and redirect
        setIsLoginModalOpen(false);
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      } else {
        // If password is wrong or user doesn't exist, show the backend's error message
        alert(data.error); 
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to connect to the backend server. Is it running?");
    }
  };

  return (
    <>
      <nav className={`fixed left-0 right-0 z-40 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between px-6 lg:px-8 ${isScrolled ? 'top-4 h-16 w-[95%] max-w-7xl bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 rounded-full' : 'top-8 h-20 w-[95%] max-w-7xl bg-white/5 backdrop-blur-md border border-white/10 rounded-full'}`}>
        
        <Link to="/" className="flex items-center gap-1 cursor-pointer">
          <span className="text-blue-600 text-3xl font-black leading-none -mt-1">V</span>
          <span className={`uppercase tracking-widest text-lg font-black ml-1 transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>imtara</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 h-full">
          {['Solutions', 'Platform', 'Concierge', 'Pricing', 'How It Works', 'Insights', 'Contact'].map((item) => {
            if (item === 'Solutions') {
              return (
                <div key={item} className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <button className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1 ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'} ${isSolutionsOpen ? (isScrolled ? 'text-blue-600' : 'text-white') : ''}`}>
                    {item} <ChevronDown size={14} className={`mt-0.5 transition-transform duration-300 ${isSolutionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div ref={dropdownRef} className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[400px] opacity-0 invisible hidden" style={{ transform: 'translateX(-50%) translateY(10px)' }}>
                    <div ref={menuContainerRef} className="bg-white rounded-2xl shadow-[0_30px_60px_rgb(0,0,0,0.12)] border border-slate-100 p-3 overflow-hidden flex flex-col gap-1 relative before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-mt-2 before:border-8 before:border-transparent before:border-b-white">
                      {solutionsMenu.map((menuItem, idx) => (
                        <Link key={idx} to={menuItem.path} ref={el => dropdownItemsRef.current[idx] = el} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group" onClick={() => setIsSolutionsOpen(false)}>
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <menuItem.icon size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{menuItem.title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{menuItem.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            if (item === 'Pricing' || item === 'Contact') {
              return <Link key={item} to={item === 'Pricing' ? '/pricing' : '/contact'} className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1 ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>{item}</Link>;
            }
            if (anchorLinks[item]) {
              return <a key={item} href={`/#${anchorLinks[item]}`} onClick={(e) => handleAnchorClick(e, anchorLinks[item])} className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-1 ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-slate-300 hover:text-white cursor-pointer'}`}>{item}</a>;
            }
            return null;
          })}
        </div>

        <div className="flex items-center gap-6">
          {/* 1. Login Link triggers the modal */}
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-400'}`}
          >
            Login
          </button>
          
          {/* 2. "Get Your Dashboard" button ALSO triggers the modal now */}
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="hidden md:flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-600/20 items-center"
          >
            Get Your Dashboard <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </nav>

      {/* LOGIN MODAL UI */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h3>
              <p className="text-sm text-slate-500">Sign in to your Compliance Command Center</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">Password</label>
                  <a href="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Forgot Password?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
          </div>
        </div>
      )}
    </>
  );
}