import { useRef } from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, Users, ArrowRight, 
  BarChart3, Database, BellRing, Lock, Activity, Zap 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function StatutoryCompliance() {
  const containerRef = useRef(null);
  const bentoRef = useRef(null);

  useGSAP(() => {
    // 1. Hero Entrance Animations
    const tl = gsap.timeline();
    tl.fromTo(".sol-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 })
      .fromTo(".sol-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".sol-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".sol-actions", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");

    // 2. Floating Parallax Elements in Hero
    gsap.to(".float-element-1", { y: -20, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".float-element-2", { y: 25, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });

    // 3. Bento Grid Staggered Reveal
    gsap.fromTo(".bento-item",
      { y: 80, opacity: 0, scale: 0.95 },
      { 
        y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", 
        scrollTrigger: { trigger: bentoRef.current, start: "top 80%" } 
      }
    );

    // 4. Dynamic Graph Animation (Triggered on scroll)
    gsap.fromTo(".graph-bar", 
      { scaleY: 0, transformOrigin: "bottom" }, 
      { 
        scaleY: 1, duration: 1.5, stagger: 0.1, ease: "elastic.out(1, 0.5)", 
        scrollTrigger: { trigger: ".graph-section", start: "top 75%" } 
      }
    );

    // 5. Scanline effect over the graph
    gsap.fromTo(".scanline",
      { top: "0%" },
      { top: "100%", duration: 2.5, repeat: -1, ease: "none", scrollTrigger: { trigger: ".graph-section", start: "top 75%" } }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-200">
      
      {/* --- HERO SECTION (Dark theme to fix navbar and add premium feel) --- */}
      <section className="relative pt-32 pb-40 bg-[#0b1221] rounded-b-[3rem] overflow-hidden border-b border-slate-800">
        {/* Ambient Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-10">
          <div className="sol-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <ShieldCheck size={14} /> Core Platform
          </div>
          
          <h1 className="sol-title text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.3)]">MCA & GST</span> filing.<br />Zero missed deadlines.
          </h1>
          
          <p className="sol-desc text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            The ultimate command center for Indian regulatory compliance. We synchronize your data directly with government portals so you can maintain a bulletproof ROC status effortlessly.
          </p>

          <div className="sol-actions flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group">
              Start Free Trial <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 hover:bg-white/5 text-white font-bold rounded-xl transition-all flex items-center justify-center">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* --- METRICS STRIP --- */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-12 mb-24">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          <div>
            <div className="text-3xl font-black text-slate-900 mb-1">99.9%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 mb-1">5M+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filings Processed</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 mb-1">&lt; 1s</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sync Latency</div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 mb-1">Bank Grade</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">256-bit Security</div>
          </div>
        </div>
      </section>

      {/* --- ADVANCED BENTO GRID FEATURES --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32" ref={bentoRef}>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Built for the Indian Regulatory Landscape</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Stop managing compliance in spreadsheets. Our platform connects directly to the source of truth.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Item 1: Large Span */}
          <div className="bento-item md:col-span-2 bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-100 transition-colors"></div>
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
              <Database size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">MCA V3 Integration</h3>
            <p className="text-slate-600 leading-relaxed max-w-md">
              Direct API syncing with the Ministry of Corporate Affairs. Automate SPICe+ tracking, annual filings, and director KYC without manual portal logins. We maintain the connection so you don't have to.
            </p>
          </div>

          {/* Bento Item 2: Vertical */}
          <div className="bento-item bg-slate-900 text-white rounded-[2rem] p-10 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-14 h-14 bg-white/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <BellRing size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Automated ROC Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Never rely on calendar reminders again. Get automated SMS, WhatsApp, and email alerts for every critical Registrar of Companies deadline.
            </p>
          </div>

          {/* Bento Item 3: Standard */}
          <div className="bento-item bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">GST Reconciliation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Reconcile your GST returns instantly. Our platform flags discrepancies before they become notices, keeping your input tax credits safe.
            </p>
          </div>

          {/* Bento Item 4: Wide */}
          <div className="bento-item md:col-span-2 bg-gradient-to-br from-slate-50 to-white rounded-[2rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
            <div>
              <div className="w-14 h-14 bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise-Grade Document Vault</h3>
              <p className="text-slate-600 text-sm max-w-sm">Securely store MOAs, AOAs, and board resolutions with immutable audit trails and role-based access control.</p>
            </div>
            <div className="w-full md:w-64 h-32 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
               <div className="text-slate-400 font-medium flex items-center gap-2"><Zap size={18} className="text-amber-500"/> End-to-End Encrypted</div>
            </div>
          </div>

        </div>
      </section>

      {/* --- DYNAMIC GRAPH VISUALIZATION SECTION --- */}
      <section className="graph-section bg-[#05080f] py-32 mb-32 relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-6">
              <BarChart3 size={14}/> Live Analytics
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Visualize your compliance health in real-time.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We eliminated the empty space and static tables. Your account management dashboard is packed with dynamic, actionable graphs that track your filing statuses, tax liability trends, and penalty risks at a single glance.
            </p>
            <ul className="space-y-5">
              {[
                'Real-time filing metrics across all state portals', 
                'Historical compliance scoring and trend lines', 
                'Predictive tax liability modeling'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-blue-400" /> 
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Abstract Dynamic Chart UI with Laser Scanline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            {/* The Scanning Laser Effect */}
            <div className="scanline absolute left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-20 opacity-50"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-500" size={24} />
                <span className="text-white font-bold tracking-wide">Q3 Compliance Tracking</span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Optimal
              </div>
            </div>
            
            <div className="flex items-end justify-between h-56 gap-4 mb-6 relative z-10">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-600 w-full h-0"></div>
              </div>

              {/* Bars - FIXED: Added h-full and flex items-end to the wrapper */}
              {[40, 70, 45, 95, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full h-full bg-slate-800/30 rounded-t-lg relative group/bar hover:bg-slate-800/80 transition-colors flex items-end">
                  
                  {/* The actual colored bar */}
                  <div 
                    className="graph-bar w-full bg-gradient-to-t from-blue-700 to-cyan-400 rounded-t-lg shadow-[0_0_20px_rgba(34,211,238,0.15)] group-hover/bar:from-blue-600 group-hover/bar:to-cyan-300 transition-colors relative" 
                    style={{ height: `${height}%` }}
                  >
                    {/* Glowing top edge highlight */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-100 rounded-t-lg opacity-70"></div>
                  </div>
                  
                  {/* Premium Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform group-hover/bar:-translate-y-2 pointer-events-none shadow-xl z-50 whitespace-nowrap">
                    {height}% Compliant
                    {/* Tooltip downward arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45"></div>
                  </div>

                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-500 font-bold relative z-10">
              <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CA PARTNERSHIP SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-32">
        <div className="w-20 h-20 bg-white border border-slate-200 shadow-xl text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-blue-100 rounded-3xl blur animate-pulse -z-10"></div>
          <Users size={36} />
        </div>
        <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Supercharge your Chartered Accountant.
        </h2>
        <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          CAs are the strategic heroes of your business. Stop slowing them down with messy email chains and missing OTPs. Give them direct, secure access to a consolidated environment where they can execute filings instantly.
        </p>
        <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto">
          Explore CA Collaboration <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
}