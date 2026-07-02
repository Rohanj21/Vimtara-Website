import { useRef, useState } from 'react';
import { Check, X, Clock, HelpCircle, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// --- FAQ Accordion Component ---
const FaqItem = ({ question, answer, isOpen, onClick }) => {
  const contentRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [isOpen]);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden mb-4 transition-colors hover:border-blue-200">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-bold text-slate-900">{question}</span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-400 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
          size={20} 
        />
      </button>
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden px-6">
        <p className="text-slate-600 pb-6 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default function Pricing() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [openFaq, setOpenFaq] = useState(0);

  const pricingTiers = [
    {
      name: "Starter",
      desc: "Perfect for small businesses",
      seats: "1 seat included",
      price: "₹4,999",
      status: "active",
      supported: "GST • TDS • MCA • Income Tax",
      features: [
        { name: "GST compliance monitoring", included: true },
        { name: "TDS compliance monitoring", included: true },
        { name: "MCA filing alerts", included: true },
        { name: "Income Tax tracking", included: true },
        { name: "Real-time dashboard", included: true },
        { name: "Email notifications", included: true },
        { name: "EPFO management", included: false },
        { name: "ESIC management", included: false },
        { name: "Priority support", included: false },
        { name: "Dedicated account manager", included: false },
        { name: "CA & CS collaboration workspace", included: false },
      ]
    },
    {
      name: "Pro",
      desc: "For growing companies",
      seats: "2 seats included",
      price: "₹7,500",
      status: "coming_soon",
      supported: "All Starter features + Labour Laws",
      features: [
        { name: "GST compliance monitoring", included: true },
        { name: "TDS compliance monitoring", included: true },
        { name: "MCA filing alerts", included: true },
        { name: "Income Tax tracking", included: true },
        { name: "Real-time dashboard", included: true },
        { name: "Email & SMS notifications", included: true },
        { name: "EPFO management", included: true },
        { name: "ESIC management", included: true },
        { name: "Priority support", included: false },
        { name: "Dedicated account manager", included: false },
        { name: "CA & CS collaboration workspace", included: true },
      ]
    },
    {
      name: "Enterprise",
      desc: "For large organizations",
      seats: "Unlimited seats",
      price: "Custom",
      status: "coming_soon",
      supported: "Full statutory coverage",
      features: [
        { name: "GST compliance monitoring", included: true },
        { name: "TDS compliance monitoring", included: true },
        { name: "MCA filing alerts", included: true },
        { name: "Income Tax tracking", included: true },
        { name: "Real-time dashboard", included: true },
        { name: "Email, SMS & WhatsApp alerts", included: true },
        { name: "EPFO management", included: true },
        { name: "ESIC management", included: true },
        { name: "Priority 24/7 support", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "CA & CS collaboration workspace", included: true },
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "What happens if I exceed my credential limits?",
      answer: "You'll be prompted to upgrade your plan. Existing credentials are never removed — only new additions are blocked until your plan is updated."
    },
    {
      question: "Do I need to migrate data manually?",
      answer: "No. Our AI securely connects to your existing government portals and ERP systems to automatically pull historical compliance data and build your timeline."
    },
    {
      question: "Can I invite my Chartered Accountant?",
      answer: "Yes. In our Pro and Enterprise tiers, you can invite your strategic partners (CAs and CSs) into a dedicated collaboration workspace with role-based access control."
    }
  ];

  useGSAP(() => {
    // Hero Section Animations
    const tl = gsap.timeline();
    tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 })
      .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".hero-banner", { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, "-=0.2");

    // Pricing Cards Staggered Reveal
    gsap.fromTo(cardsRef.current, 
      { y: 100, opacity: 0, rotateX: 10, transformPerspective: 1000 },
      { 
        y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".pricing-grid", start: "top 75%" }
      }
    );

    // Trust Logos Reveal
    gsap.fromTo(".trust-logo",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".trust-section", start: "top 85%" } }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-200">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-48 bg-[#0b1221] overflow-hidden rounded-b-[3rem]">
        {/* Ambient Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <div className="hero-badge flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
            Simple, transparent pricing
          </div>
          
          <h1 className="hero-title text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            One platform.<br />
            <span className="text-blue-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.2)]">Every compliance need.</span>
          </h1>
          
          <p className="hero-desc text-lg text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            No hidden fees. No per-user charges. Just pick the plan that fits your business and get started in minutes.
          </p>

          {/* Trial Banner */}
          <div className="hero-banner w-full max-w-3xl bg-[#edfff8] border border-[#a7f3d0] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative z-20">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Try Vimtara free for 7 days</h3>
                <p className="text-sm text-slate-600 mt-1">Full Starter features, plus up to 20 orgs, 10 seats — <span className="font-semibold text-slate-900 border-b border-slate-300">no credit card required</span>.</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 group shrink-0">
              Start Free Trial <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- PRICING CARDS --- */}
      <section className="max-w-7xl mx-auto px-6 relative z-30 -mt-24 mb-24">
        <div className="pricing-grid grid md:grid-cols-3 gap-8 items-start">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              ref={el => cardsRef.current[index] = el}
              className={`relative bg-white rounded-3xl p-8 lg:p-10 transition-all duration-300 flex flex-col ${
                tier.status === 'active' 
                  ? 'border-2 border-blue-500 shadow-[0_20px_40px_rgb(59,130,246,0.1)] -translate-y-4' 
                  : 'border border-slate-200 shadow-sm opacity-90 grayscale-[0.2]'
              }`}
            >
              {/* Coming Soon Badge */}
              {tier.status === 'coming_soon' && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Clock size={12} /> Coming Soon
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{tier.desc}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-100">
                  <HelpCircle size={14} className="text-slate-400" /> {tier.seats}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {tier.price === 'Custom' ? (
                    <span className="text-5xl font-black text-slate-900 tracking-tight">Custom</span>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tight">{tier.price}</span>
                      <span className="text-slate-500 font-medium">/month</span>
                    </>
                  )}
                </div>
              </div>

              {/* Supported Tech Pill */}
              <div className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold text-center py-2 rounded-lg mb-8">
                {tier.supported}
              </div>

              {/* Features List */}
              <div className="flex-grow">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">What's Included</div>
                <ul className="space-y-3.5">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      {feature.included ? (
                        <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X size={18} className="text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button 
                className={`mt-10 w-full py-3.5 rounded-xl font-bold transition-all ${
                  tier.status === 'active'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                disabled={tier.status === 'coming_soon'}
              >
                {tier.status === 'active' ? 'Get Started' : 'Join Waitlist'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- TRUSTED BY LOGOS --- */}
      <section className="trust-section max-w-5xl mx-auto px-6 py-12 border-t border-slate-200/60 mb-16 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by businesses across India</p>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-40 grayscale">
          {['GST', 'TDS', 'MCA', 'EPFO', 'ESIC', 'Income Tax'].map((logo, idx) => (
            <span key={idx} className="trust-logo text-2xl font-black text-slate-800 tracking-tight">{logo}</span>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="max-w-3xl mx-auto px-6 py-16 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500">Everything you need to know about our pricing and plans.</p>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            />
          ))}
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-24 text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Ready to simplify your compliance?</h2>
          <p className="text-blue-100 text-lg mb-10">Join hundreds of businesses who trust Vimtara to stay compliant without the headache.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group">
              Get Started Today <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl transition-colors">
              Talk to Sales
            </button>
          </div>
          
          <div className="text-xs text-blue-200/60 font-medium">
            Disclaimer: Vimtara is an independent statutory compliance service provider, not a government entity.
          </div>
        </div>
      </section>

      {/* Floating Chat Icon (UI visual only to match screenshot) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-colors relative">
          <MessageCircle size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold">1</div>
        </div>
      </div>
      
    </div>
  );
}