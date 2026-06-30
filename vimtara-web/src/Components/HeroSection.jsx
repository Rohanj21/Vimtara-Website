import { useRef } from 'react';
import { ArrowRight, ShieldCheck, Activity, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const StatCard = ({ number, label, highlight }) => (
  <div className="text-center group">
    <div className="text-4xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
      {number}<span className="text-blue-500">{highlight}</span>
    </div>
    <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{label}</div>
  </div>
);

const ComplianceRow = ({ title, status, time, message, type }) => {
  const getStatusStyle = () => {
    switch(type) {
      case 'scanned': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'scanning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'alert': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-700/50 hover:border-slate-500/50 hover:bg-[#1f2b45] transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'scanned' ? 'bg-emerald-500' : type === 'scanning' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
        <div>
          <div className="font-bold text-slate-200 text-sm">{title}</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
             {type === 'alert' ? <AlertTriangle size={10} className="text-rose-500"/> : <CheckCircle2 size={10} className="text-emerald-500"/>}
             {message}
          </div>
        </div>
      </div>
      <div className={`text-[9px] font-bold px-2 py-1 rounded border uppercase ${getStatusStyle()}`}>
        {status} <span className="opacity-60 font-normal lowercase">{time}</span>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Subtle float animation for the dashboard
    gsap.to(".float-anim", {
      y: -15, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-[#0b101d] pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> AI-Powered Statutory Compliance
          </div>
          <h1 className="text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
            Statutory Compliance, <br/><span className="text-blue-500">Fully Managed with AI.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Vimtara's Compliance Command Center resolves issues before they become penalties. 
            Automated monitoring across all portals.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Get Your Compliance Dashboard
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Side: The Dashboard Card */}
        <div className="float-anim relative">
           <div className="absolute -top-4 right-6 bg-[#064e3b] border border-[#047857] text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase z-20 shadow-lg">
             AI Monitoring — 24x7
           </div>
           
           <div className="bg-[#151c2e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <Activity className="text-blue-500" size={20} />
                <h3 className="text-xs font-bold tracking-widest text-white uppercase">Compliance Command Center</h3>
             </div>
             
             <div className="space-y-3">
               <ComplianceRow title="GST" status="Scanned" time="2m ago" type="scanned" message="No new notices. GSTR-3B filed." icon={CheckCircle2} />
               <ComplianceRow title="MCA (ROC)" status="Scanned" time="5m ago" type="scanned" message="Annual return AOC-4 filed." icon={CheckCircle2} />
               <ComplianceRow title="EPFO" status="Scanning" time="now" type="scanning" message="Checking Jan 2026 challan status..." icon={Clock} />
               <ComplianceRow title="TRACES" status="Alert" time="1m ago" type="alert" message="TDS certificate mismatch." icon={AlertTriangle} />
               <ComplianceRow title="Income Tax" status="Scanned" time="8m ago" type="scanned" message="ITR-6 filed for AY 2025-26." icon={CheckCircle2} />
             </div>
           </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16">
        <StatCard number="100" highlight="+" label="Companies Onboarded" />
        <StatCard number="30" highlight="" label="Day Advance Warnings" />
        <StatCard number="12" highlight="+" label="Govt. Systems Connected" />
        <StatCard number="48" highlight="h" label="Dashboard Live from Signup" />
      </div>
    </section>
  );
}