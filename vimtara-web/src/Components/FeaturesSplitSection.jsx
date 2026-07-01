import { useRef } from 'react';
import { Target, Eye, Users, TrendingUp, Shield, ShieldCheck, UserCog, FileCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TargetAndSecuritySection() {
  const containerRef = useRef(null);

  const audienceCards = [
    { icon: Target, title: "Founders & CEOs", desc: "See your compliance health in one glance. Issues get resolved without you lifting a finger." },
    { icon: Eye, title: "CFOs Seeking Visibility", desc: "Real-time dashboard across every compliance area. One click to resolve any issue." },
    { icon: Users, title: "Multi-Entity Companies", desc: "All entities, all compliances, one platform. Expert support scales with you." },
    { icon: TrendingUp, title: "Rapidly Scaling Teams", desc: "From self-serve to fully managed - choose the level of support you need as you grow." }
  ];

  const securityCards = [
    { icon: Shield, title: "End-to-End Encryption", desc: "AES-256 encryption for data at rest and in transit", color: "emerald" },
    { icon: ShieldCheck, title: "Audited Controls", desc: "Audited security controls and compliance", color: "blue" },
    { icon: UserCog, title: "Role-Based Access", desc: "Granular permissions and audit trails", color: "fuchsia" },
    { icon: FileCheck, title: "ISO 27001:2022 Certified", desc: "Internationally recognized information security management certification", color: "orange" }
  ];

  useGSAP(() => {
    // 3D Perspective Reveal Animation
    gsap.fromTo(".reveal-card", 
      { 
        y: 60, 
        opacity: 0, 
        rotateX: -15, 
        transformPerspective: 1000 
      },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );

    // Header fade-in
    gsap.fromTo(".reveal-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white py-24 lg:py-32 relative border-t border-slate-100 overflow-hidden">
      
      {/* Central Vertical Divider (Visible only on large screens) */}
      <div className="hidden lg:block absolute left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 lg:gap-32 relative z-10">
        
        {/* LEFT COLUMN: Target Audience */}
        <div className="flex flex-col items-center text-center">
          <div className="reveal-header mb-12">
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">Is Vimtara For You?</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Vimtara Is <span className="text-blue-600">Perfect For</span>
            </h3>
            <p className="text-slate-600 text-lg">AI handles compliance. You handle the business.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {audienceCards.map((card, idx) => (
              <div key={idx} className="reveal-card group bg-white border border-slate-200 hover:border-blue-200 rounded-[2rem] p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-300">
                  <card.icon size={24} strokeWidth={2} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">{card.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Enterprise Security */}
        <div className="flex flex-col items-center text-center">
          <div className="reveal-header mb-12">
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">Enterprise-Grade Security</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              <span className="text-blue-600">Security</span> at the Core
            </h3>
            <p className="text-slate-600 text-lg">Your sensitive data deserves the highest level of protection.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {securityCards.map((card, idx) => {
              // Dynamic color mapping for pastel themes matching the design
              const colorStyles = {
                emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
                blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
                fuchsia: "bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-100",
                orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
              };

              return (
                <div key={idx} className="reveal-card group bg-white border border-slate-200 hover:border-slate-300 rounded-[2rem] p-8 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center cursor-default">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorStyles[card.color]}`}>
                    <card.icon size={24} strokeWidth={2} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">{card.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}