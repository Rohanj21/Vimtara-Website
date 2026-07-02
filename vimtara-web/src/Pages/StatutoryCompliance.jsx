import { useRef } from 'react';
import { ShieldCheck, FileText, CheckCircle2, TrendingUp, Users, ArrowRight, BarChart3, Database } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function StatutoryCompliance() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Hero Entrance
    const tl = gsap.timeline();
    tl.fromTo(".sol-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 })
      .fromTo(".sol-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".sol-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4");

    // Staggered Feature Cards
    gsap.fromTo(".feature-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".feature-grid", start: "top 80%" } }
    );

    // Dynamic Graph Animation
    gsap.fromTo(".graph-bar", 
      { scaleY: 0, transformOrigin: "bottom" }, 
      { scaleY: 1, duration: 1.5, stagger: 0.1, ease: "elastic.out(1, 0.5)", scrollTrigger: { trigger: ".graph-section", start: "top 75%" } }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-white font-sans pt-32 pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] -z-10"></div>
        
        <div className="sol-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
          <ShieldCheck size={14} /> Statutory Compliance
        </div>
        
        <h1 className="sol-title text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Master <span className="text-blue-600">MCA & GST</span> filing.<br />Zero missed deadlines.
        </h1>
        
        <p className="sol-desc text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          The ultimate command center for Indian regulatory compliance. We synchronize your data directly with government portals so you can maintain a bulletproof ROC status effortlessly.
        </p>

        <div className="sol-desc flex justify-center gap-4">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 group">
            Start Free Trial <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for the Indian Regulatory Landscape</h2>
        </div>
        
        <div className="feature-grid grid md:grid-cols-3 gap-8">
          {[
            { title: "MCA V3 Integration", desc: "Direct API syncing with the Ministry of Corporate Affairs. Automate SPICe+ tracking, annual filings, and director KYC without manual portal logins.", icon: Database },
            { title: "GST & Tax Synchronization", desc: "Reconcile your GST returns instantly. Our platform flags discrepancies before they become notices, keeping your input tax credits safe.", icon: FileText },
            { title: "Automated ROC Alerts", desc: "Never rely on calendar reminders again. Get automated SMS, WhatsApp, and email alerts for every critical Registrar of Companies deadline.", icon: CheckCircle2 }
          ].map((feat, idx) => (
            <div key={idx} className="feature-card bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <feat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC GRAPH VISUALIZATION SECTION --- */}
      <section className="graph-section bg-[#0b1221] py-24 mb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">
              Visualize your compliance health in real-time.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We eliminated the empty space and static tables. Your account management dashboard is packed with dynamic, actionable graphs that track your filing statuses, tax liability trends, and penalty risks at a single glance.
            </p>
            <ul className="space-y-4">
              {['Real-time filing metrics', 'Historical compliance scoring', 'Predictive tax liability modeling'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-blue-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Abstract Dynamic Chart UI */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-blue-400" size={24} />
                <span className="text-white font-bold">Q3 Compliance Tracking</span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">Optimal</div>
            </div>
            
            <div className="flex items-end justify-between h-48 gap-4 mb-4">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full bg-slate-800 rounded-t-md relative group">
                  <div 
                    className="graph-bar absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CA PARTNERSHIP SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-24">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Users size={32} />
        </div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Supercharge your Chartered Accountant.
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          CAs are the strategic heroes of your business. Stop slowing them down with messy email chains and missing OTPs. Give them direct, secure access to a consolidated environment where they can execute filings instantly.
        </p>
      </section>

    </div>
  );
}