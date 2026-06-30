import { useRef } from 'react';
import { CheckCircle2, AlertTriangle, Clock, RefreshCcw, ShieldCheck, Wallet, ChevronRight, Activity } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PlatformSection() {
  const sectionRef = useRef(null);
  const graphBarsRef = useRef([]);

  useGSAP(() => {
    // Scroll reveal for the entire dashboard
    gsap.fromTo(".dash-element", 
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );

    // Dynamic graph animation for the Account Management widget
    gsap.to(graphBarsRef.current, {
      height: () => Math.random() * 24 + 8 + "px",
      duration: 0.6,
      ease: "sine.inOut",
      stagger: { amount: 0.5, yoyo: true, repeat: -1 },
      repeat: -1,
      yoyo: true,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-white py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Your Platform</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Your Statutory Compliance <span className="text-blue-600">Command Centre</span>
          </h3>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            AI connects to all your systems - government portals, accounting, payroll, banking. Everything in one dashboard. Every issue, one click to resolve.
          </p>
        </div>

        {/* Main Dashboard Container */}
        <div className="dash-element bg-[#f8fafc] rounded-[2rem] border border-slate-200 shadow-2xl p-6 lg:p-10 relative overflow-hidden">
          
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} /> AI: Monitoring All Systems
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Activity size={14} /> All Systems Connected
              </div>
            </div>
            <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
              <RefreshCcw size={12} /> Last scan: 2 min ago
            </div>
          </div>

          {/* 3-Column Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: Score & Metrics (Span 3) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Score Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                  {/* Simulated Donut Chart */}
                  <div className="relative w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center">
                     <div className="absolute inset-0 rounded-full border-8 border-amber-500 border-l-transparent border-b-transparent transform rotate-45"></div>
                     <div className="text-center">
                        <div className="text-2xl font-black text-slate-900 leading-none">82</div>
                        <div className="text-[9px] font-bold text-slate-400">SCORE</div>
                     </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Good Standing</h4>
                    <p className="text-xs text-slate-500 mb-1">2 items need attention</p>
                    <p className="text-xs text-blue-500 flex items-center gap-1"><RefreshCcw size={10}/> 12 areas monitored</p>
                  </div>
                </div>
              </div>

              {/* 2x2 Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">Next Deadline <Clock size={12} className="text-amber-500"/></div>
                  <div className="text-xl font-black text-slate-900 mb-1">14d</div>
                  <div className="text-xs text-slate-500 leading-tight">TDS Q3 Filing (Form 26Q)</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">Penalties Saved <Activity size={12} className="text-emerald-500"/></div>
                  <div className="text-xl font-black text-slate-900 mb-1">₹145K</div>
                  <div className="text-xs text-slate-500 leading-tight">Risk avoided</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">Engine Checks <Activity size={12} className="text-fuchsia-500"/></div>
                  <div className="text-xl font-black text-slate-900 mb-1">128</div>
                  <div className="text-xs text-slate-500 leading-tight">This month</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">System Status <CheckCircle2 size={12} className="text-blue-500"/></div>
                  <div className="text-lg font-black text-slate-900 mb-1">Online</div>
                  <div className="text-xs text-slate-500 leading-tight">All systems go</div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Portals Grid (Span 5) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-900 flex items-center gap-2"><Activity size={16} className="text-blue-600"/> Connected Government Portals</h4>
                <span className="text-xs text-slate-400">12 areas</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "GST", status: "FILED", color: "emerald" },
                  { name: "TDS", status: "DUE 14D", color: "amber" },
                  { name: "MCA", status: "FILED", color: "emerald" },
                  { name: "EPFO", status: "PAID", color: "emerald" },
                  { name: "ESIC", status: "PAID", color: "emerald" },
                  { name: "Income Tax", status: "NO DUES", color: "emerald" },
                  { name: "e-Invoice", status: "SYNCED", color: "emerald" },
                  { name: "e-Way Bill", status: "VALID", color: "emerald" },
                  { name: "TRACES", status: "AUTH ERROR", color: "rose" },
                  { name: "FEMA", status: "N/A", color: "slate" },
                  { name: "Listing", status: "N/A", color: "slate" },
                  { name: "ROC", status: "COMPLIANT", color: "emerald" },
                ].map((portal, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center
                    ${portal.color === 'emerald' ? 'border-emerald-100 bg-emerald-50/30' : 
                      portal.color === 'amber' ? 'border-amber-200 bg-amber-50/50' : 
                      portal.color === 'rose' ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="text-[11px] font-bold text-slate-800 mb-2">{portal.name}</div>
                    <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                      ${portal.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 
                        portal.color === 'amber' ? 'bg-amber-100 text-amber-700' : 
                        portal.color === 'rose' ? 'bg-rose-100 text-rose-700' : 'text-slate-400'}`}>
                      {portal.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: Actions & Dues (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Priority Action Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <h4 className="font-bold text-slate-900">Priority Action</h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-4">See an issue? Click to resolve it. Our experts handle the rest. <span className="text-blue-500 cursor-pointer">Or Assign it to your CA on the Platform</span></p>
                
                <div className="border-l-4 border-rose-500 pl-4 py-1 mb-4">
                  <div className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-2">CRITICAL</div>
                  <h5 className="font-bold text-slate-900 text-sm">GST Notice - Show Cause Order</h5>
                  <p className="text-[11px] text-slate-500 mt-1">ITC mismatch notice for FY 2023-24. Response required.</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Deadline</div>
                      <div className="font-bold text-slate-900 text-sm">Feb 14, 2026</div>
                      <div className="text-[9px] text-amber-600 flex items-center gap-1"><Clock size={10}/> 28 days remaining</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Potential Impact</div>
                      <div className="font-bold text-slate-900 text-sm">₹4,250</div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  Get Help from Vimtara <ChevronRight size={16}/>
                </button>
              </div>

              {/* Account Management: Cash & Statutory Dues */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2"><Wallet size={16} className="text-blue-600"/> Cash & Statutory Dues</h4>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-4 relative overflow-hidden">
                  <div className="text-xs text-slate-500 font-medium mb-1 relative z-10">Statutory Wallet</div>
                  <div className="text-2xl font-black text-slate-900 relative z-10">₹45,235</div>
                  
                  {/* Dynamic Graph filling visual space */}
                  <div className="absolute bottom-0 right-4 h-12 flex items-end gap-1 opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} ref={el => graphBarsRef.current[i] = el} className="w-1.5 bg-blue-600 rounded-t-sm"></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Clock size={12}/> Upcoming (30 days)</span>
                    <span className="font-bold text-slate-900">₹6,120</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-amber-50/50 p-2 rounded">
                    <span className="text-amber-700 flex items-center gap-1"><AlertTriangle size={12}/> GST (Dec 2025)</span>
                    <span className="font-bold text-slate-900">₹3,450</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-amber-50/50 p-2 rounded">
                    <span className="text-amber-700 flex items-center gap-1"><AlertTriangle size={12}/> TDS Q3 (26Q)</span>
                    <span className="font-bold text-slate-900">₹1,850</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 text-emerald-700 p-3 rounded-xl font-bold text-sm">
                  <span className="flex items-center gap-1"><Activity size={14}/> Net Position</span>
                  <span>₹39,115</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
           <p className="text-slate-500 mb-4 text-sm">Our team will guide you end-to-end through a seamless onboarding experience.</p>
           <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mx-auto">
             Get Your Dashboard <ChevronRight size={16}/>
           </button>
        </div>
      </div>
    </section>
  );
}