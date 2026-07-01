import { useRef, useState } from 'react';
import { Activity, Globe, Clock, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Lock, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const rightSectionsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { title: "AI Connects to All Your Systems", desc: "Not just government portals. AI connects to accounting, payroll, banking, and more." },
    { title: "One Dashboard, Complete Visibility", desc: "All your compliance data across every system, in one place." },
    { title: "One-Click Issue Resolution", desc: "Dashboard flags an issue? Click 'Resolve'. Experts take over." },
    { title: "On-Demand Expert Support", desc: "Reach out anytime. Get answers, file responses, handle notices." },
    { title: "Secure Dataroom", desc: "All your documents, organized and secure. Your business source of truth." }
  ];

  useGSAP(() => {
    // Left Navigation Staggered Entrance
    gsap.fromTo(".nav-card", 
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 70%" } }
    );

    // Right Side ScrollSpy & Entrance Animations
    rightSectionsRef.current.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActiveIndex(index);
        }
      });

      gsap.fromTo(section,
        { y: 80, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, { scope: containerRef });

  // GSAP Smooth Scroll to specific section
  const scrollToSection = (index) => {
    const target = rightSectionsRef.current[index];
    if (target) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: target, offsetY: 120 }, // Offsets for the sticky header
        ease: "power3.inOut"
      });
    }
  };

  return (
    <section ref={containerRef} className="bg-[#f8fafc] py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16 relative">
        
        {/* LEFT COLUMN: Interactive Card Navigation */}
        <div className="lg:w-1/3 relative hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="mb-8 px-2">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">How Vimtara Works</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-[#0f172a] leading-[1.1] tracking-tight">
                From Visibility <br />
                to <span className="text-blue-600">Fully Managed</span>
              </h3>
            </div>

            {/* Expandable Menu Cards */}
            <div className="flex flex-col gap-2">
              {navItems.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => scrollToSection(idx)}
                    className={`nav-card cursor-pointer transition-all duration-500 rounded-xl border-2 p-5 ${
                      isActive 
                        ? 'border-blue-100 bg-blue-50/30 shadow-sm scale-100' 
                        : 'border-transparent bg-transparent opacity-50 hover:opacity-100 scale-95 origin-left hover:scale-100 hover:bg-slate-100/30'
                    }`}
                  >
                    <h4 className={`text-lg font-bold transition-colors duration-500 ${
                      isActive ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {item.title}
                    </h4>
                    
                    {/* Smooth Accordion Subtitle Reveal */}
                    <div className={`grid transition-all duration-500 ease-in-out ${
                      isActive ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                    }`}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Content Cards */}
        <div className="lg:w-2/3 space-y-16">
          
          {/* Card 1: AI Connects */}
          <div ref={el => rightSectionsRef.current[0] = el} className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
             <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">AI Connects to all your systems</div>
             <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Not just government portals. Any system you use.</h4>
             <p className="text-slate-600 mb-10 text-lg leading-relaxed">
               AI connects to your accounting software, payroll systems, banking platforms, GST, MCA, EPFO, and more. If it has data, AI can monitor it.<br/><br/>
               You get <strong className="text-blue-600">real-time status</strong> by logging into a single system.
             </p>
             
             <div className="grid md:grid-cols-3 gap-4 mb-10">
               <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 flex gap-3 items-start">
                 <Activity size={18} className="text-blue-500 mt-0.5 shrink-0"/>
                 <div>
                   <div className="text-sm font-bold text-slate-900 mb-1">Government Portals</div>
                   <div className="text-[11px] text-slate-500 leading-relaxed">GST, MCA, EPFO, ESIC, Income Tax, TRACES</div>
                 </div>
               </div>
               <div className="bg-[#fffbeb] border border-amber-50 rounded-2xl p-5 flex gap-3 items-start">
                 <Globe size={18} className="text-amber-500 mt-0.5 shrink-0"/>
                 <div>
                   <div className="text-sm font-bold text-slate-900 mb-1">Business Systems</div>
                   <div className="text-[11px] text-slate-500 leading-relaxed">Accounting, payroll, banking platforms</div>
                 </div>
               </div>
               <div className="bg-[#f0fdf4] border border-emerald-50 rounded-2xl p-5 flex gap-3 items-start">
                 <Clock size={18} className="text-emerald-500 mt-0.5 shrink-0"/>
                 <div>
                   <div className="text-sm font-bold text-slate-900 mb-1">24/7 Monitoring</div>
                   <div className="text-[11px] text-slate-500 leading-relaxed">Not monthly. Not weekly. Always.</div>
                 </div>
               </div>
             </div>

             <div className="space-y-4">
               <div className="border-l-4 border-emerald-500 rounded-xl p-5 border-y border-r border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                   <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Connected</span>
                   <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">GST Portal</span>
                 </div>
                 <h5 className="font-bold text-slate-900 text-base">GSTR-3B Dec filed. No new notices.</h5>
                 <p className="text-xs text-slate-500 mt-1.5">All returns up to date. Next filing due in 28 days.</p>
               </div>
               <div className="border-l-4 border-rose-500 rounded-xl p-5 border-y border-r border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                   <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Alert</span>
                   <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">TRACES</span>
                 </div>
                 <h5 className="font-bold text-slate-900 text-base">TDS certificate mismatch detected</h5>
                 <p className="text-xs text-slate-500 mt-1.5">Form 16A discrepancy for Q3 FY26. Action required.</p>
               </div>
             </div>
          </div>

          {/* Card 2: Complete Visibility */}
          <div ref={el => rightSectionsRef.current[1] = el} className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
             <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Complete Visibility</div>
             <h4 className="text-3xl font-extrabold text-slate-900 mb-4">All your statutory compliance data. One dashboard.</h4>
             <p className="text-slate-600 mb-10 text-lg leading-relaxed">
               All your statutory compliance data across every system, in one place. AI flags what needs attention so you don't have to check anything manually, calculates risk scores and surfaces obligations 30 days before they're due.
               <br/><br/>
               <strong className="text-slate-900">Every system connected. Every issue visible.</strong>
             </p>
             
             <div className="grid md:grid-cols-2 gap-10">
               <div>
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Connected Systems</div>
                 <div className="flex flex-wrap gap-2.5 mb-8">
                   {['GST', 'MCA', 'EPFO', 'ESIC', 'Income Tax', 'TRACES'].map(sys => (
                     <span key={sys} className="px-4 py-2 bg-[#f0fdf4] text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">{sys}</span>
                   ))}
                 </div>
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Also Connecting:</div>
                 <div className="flex flex-wrap gap-2.5">
                   {['Tally', 'Zoho Books', 'RazorpayX', 'Banking APIs'].map(sys => (
                     <span key={sys} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">{sys}</span>
                   ))}
                 </div>
               </div>
               <div>
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">What you get:</div>
                 <ul className="space-y-4">
                   {['Unified timeline across all systems', 'Cross-system intelligence', 'AI flags issues automatically', 'One click to resolve anything'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                       <CheckCircle2 size={18} className="text-emerald-500 shrink-0"/> {item}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>

          {/* Card 3: Issue Resolution */}
          <div ref={el => rightSectionsRef.current[2] = el} className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">One-click issue resolution</div>
            <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Dashboard flags an issue. You click "Resolve". Done.</h4>
            <p className="text-slate-600 mb-12 text-lg leading-relaxed">
               When the dashboard flags an issue, you click "Resolve" and Vimtara's expert network already knows the issue, the urgency, and the impact. No emails. No calls. No briefing anyone. Every action tracked with a full audit trail.
             </p>
            
            <div className="flex items-center justify-between border border-slate-100 bg-slate-50 rounded-2xl p-8 mb-6 relative">
               <div className="absolute top-1/2 left-8 right-8 h-px bg-slate-200 -z-10 -translate-y-1/2"></div>
               
               <div className="flex flex-col items-center bg-slate-50 px-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 mb-3 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                 <div className="text-[10px] text-emerald-600 font-bold uppercase">AI Detects</div>
                 <div className="text-xs font-bold text-slate-800 mt-1">Issue Flagged</div>
               </div>
               <div className="flex flex-col items-center bg-slate-50 px-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 mb-3 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                 <div className="text-[10px] text-emerald-600 font-bold uppercase">One Click</div>
                 <div className="text-xs font-bold text-slate-800 mt-1">Click Resolve</div>
               </div>
               <div className="flex flex-col items-center bg-slate-50 px-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 mb-3 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                 <div className="text-[10px] text-emerald-600 font-bold uppercase">Instantly</div>
                 <div className="text-xs font-bold text-slate-800 mt-1">Expert Assigned</div>
               </div>
               <div className="flex flex-col items-center bg-slate-50 px-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 mb-3 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                 <div className="text-[10px] text-emerald-600 font-bold uppercase">You're Updated</div>
                 <div className="text-xs font-bold text-slate-800 mt-1">Issue Handled</div>
               </div>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Expert Network Active • Average Resolution: 24 Hours
            </div>
          </div>

          {/* Card 4: Expert Support */}
          <div ref={el => rightSectionsRef.current[3] = el} className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
             <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">On-demand expert support</div>
             <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Reach out anytime. Get expert help instantly.</h4>
             <p className="text-slate-600 mb-10 leading-relaxed text-lg">
               Reach out anytime through the platform. Invite your existing CA, CS, or compliance consultant directly into your Vimtara workspace. Assign tasks, share documents, and track progress - all inside the platform.
               <br/><br/>
               Role-based access means your consultant sees exactly what you want them to see. No more email threads or shared drives.
             </p>
             
             <div className="grid md:grid-cols-3 gap-6 mb-10">
               <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-100">
                 <ShieldCheck className="text-blue-500 mb-4" size={28}/>
                 <h5 className="font-bold text-slate-900 text-sm mb-2">Ask Anything</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">Get expert answers on any compliance question</p>
               </div>
               <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-100">
                 <FileText className="text-blue-500 mb-4" size={28}/>
                 <h5 className="font-bold text-slate-900 text-sm mb-2">File Responses</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">Experts handle notices and filings for you</p>
               </div>
               <div className="bg-[#f0fdf4] rounded-2xl p-6 border border-emerald-50">
                 <Activity className="text-emerald-500 mb-4" size={28}/>
                 <h5 className="font-bold text-slate-900 text-sm mb-2">Full Audit Trail</h5>
                 <p className="text-xs text-slate-500 leading-relaxed">Every conversation and action tracked</p>
               </div>
             </div>

             <div className="space-y-3">
               {[
                 { title: "GST Notice Response Filed", desc: "Handled by Expert CA", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
                 { title: "TDS Query Resolved", desc: "Response in 2 hours", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                 { title: "EPFO Compliance Review", desc: "Completed • Report Available", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                       <item.icon size={18} className={item.color}/>
                     </div>
                     <div>
                       <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                       <div className="text-[11px] text-slate-500">{item.desc}</div>
                     </div>
                   </div>
                   <CheckCircle2 size={16} className="text-emerald-500"/>
                 </div>
               ))}
             </div>
          </div>

          {/* Card 5: Secure Dataroom */}
          <div ref={el => rightSectionsRef.current[4] = el} className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
             <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Secure Dataroom</div>
             <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Your source of truth, organized.</h4>
             <p className="text-slate-600 mb-10 text-lg leading-relaxed">
               Every single document related to your business is securely stored, indexed, and available at a moment's notice.
             </p>
             
             <div className="grid md:grid-cols-2 gap-8 mb-8">
               <div className="space-y-3">
                 {[
                   { title: "Certificate of Incorporation", desc: "v1.2 • Jan 12, 2026", icon: FileText, color: "text-amber-500" },
                   { title: "GST Registration (REG-06)", desc: "Dec 20, 2025", icon: FileText, color: "text-blue-500" },
                   { title: "Board Meeting Minutes", desc: "Q4 2025 • Nov 15", icon: FileText, color: "text-indigo-500" }
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 shadow-sm">
                     <div className="flex items-center gap-3">
                       <doc.icon size={18} className={doc.color}/>
                       <div>
                         <div className="font-bold text-slate-900 text-sm">{doc.title}</div>
                         <div className="text-[11px] text-slate-500">{doc.desc}</div>
                       </div>
                     </div>
                     <ShieldCheck size={16} className="text-emerald-500"/>
                   </div>
                 ))}
               </div>

               <div className="bg-[#f8fafc] rounded-2xl p-8 border border-slate-100 flex flex-col justify-center">
                 <Lock className="text-blue-600 mb-4" size={28}/>
                 <h5 className="font-bold text-slate-900 text-lg mb-2">AES-256 Encrypted</h5>
                 <p className="text-sm text-slate-600 leading-relaxed mb-6">
                   Your data is encrypted at rest and in transit. Only authorized users can access sensitive files.
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {['SOC2 Type II', 'GDPR Compliant', 'ISO 27001'].map(cert => (
                     <span key={cert} className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded border border-blue-100">{cert}</span>
                   ))}
                 </div>
               </div>
             </div>

             <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Highly Secure • 99.9% Uptime
                </div>
                <button className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:text-blue-600 transition-colors">
                  Go to Dataroom <ChevronRight size={16}/>
                </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}