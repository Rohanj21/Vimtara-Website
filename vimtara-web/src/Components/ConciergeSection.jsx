import { useRef } from 'react';
import { Rocket, TrendingUp, ShieldCheck, LogOut, Building2, Award, FileText, PieChart, Users, Presentation, Copyright, XCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const IllustrationPlaceholder = ({ icon: Icon, elements }) => (
  <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-[#f0f4f8] rounded-t-xl relative overflow-hidden flex items-center justify-center border-b border-slate-100">
    {/* Abstract Circuit/Tech Background Lines */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
    
    {/* Central Floating Icon */}
    <div className="relative z-10 w-20 h-20 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-500">
       <Icon size={40} className="text-white" />
    </div>

    {/* Floating Decorative Elements */}
    {elements.map((El, i) => (
      <div key={i} className={`absolute text-blue-400/60 ${El.pos}`}>
        <El.icon size={El.size} />
      </div>
    ))}
  </div>
);

export default function ConciergeSection() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const conciergeData = [
    {
      id: "launch",
      title: "Launch (The start)",
      icon: Rocket,
      desc: "Services for founders who are turning an idea into a legal entity. From company registration to startup recognition, we help you build a strong legal foundation from day one.",
      services: [
        { title: "Company Incorporation", desc: "Don't just register a company. Launch an audit-ready startup. Get your Certificate of Incorporation, PAN, and TAN compliant with MCA guidelines.", icon: Building2, elements: [{icon: FileText, pos: "top-8 left-8", size: 20}, {icon: PieChart, pos: "bottom-8 right-12", size: 24}] },
        { title: "Startup India Registration", desc: "Unlock the benefits you deserve. 50% of applications get rejected due to generic 'Innovation Notes'. We craft DPIIT-compliant applications to secure tax exemptions.", icon: Award, elements: [{icon: Rocket, pos: "top-12 right-10", size: 20}, {icon: Building2, pos: "bottom-10 left-10", size: 18}] },
        { title: "GST Registration", desc: "Get GST-ready without the office visit nightmare. Operating without GST is illegal if you have interstate supply. We ensure seamless filing and input tax credit setup.", icon: FileText, elements: [{icon: ShieldCheck, pos: "top-10 left-12", size: 22}, {icon: Award, pos: "bottom-12 right-8", size: 20}] },
      ]
    },
    {
      id: "scale",
      title: "Scale (The growth)",
      icon: TrendingUp,
      desc: "Services for founders who are raising capital and building teams. From valuations to ESOPs to pitch decks, we provide the tools you need to scale with confidence.",
      services: [
        { title: "Company Valuation", desc: "Know your worth. Defend your value. Whether you are raising funds or issuing shares, get a robust valuation report backing your numbers.", icon: PieChart, elements: [{icon: TrendingUp, pos: "top-8 right-8", size: 24}, {icon: Users, pos: "bottom-8 left-12", size: 20}] },
        { title: "ESOP Pool Creation", desc: "Turn employees into owners. Legally. Stop relying on basic templates. We structure dynamic equity plans that vest fairly and protect the founders.", icon: Users, elements: [{icon: Award, pos: "top-10 left-10", size: 20}, {icon: PieChart, pos: "bottom-10 right-10", size: 22}] },
        { title: "Pitch Deck Creation", desc: "Decks that raise capital, not just eyebrows. Investors want clear metrics and compliance transparency. We build decks that speak their language.", icon: Presentation, elements: [{icon: FileText, pos: "top-12 right-12", size: 18}, {icon: Rocket, pos: "bottom-12 left-8", size: 24}] },
      ]
    },
    {
      id: "secure",
      title: "Secure (The Defense)",
      icon: ShieldCheck,
      desc: "Build a fortress around your business. Growth is dangerous if your foundation is weak. We safeguard your intellectual property and ensure your annual compliance is bulletproof, so you never face theft or penalties.",
      services: [
        { title: "Trademark Registration", desc: "Don't just use a logo. Own your brand asset. We secure your intellectual property with a mandatory trademark filing to prevent competitor infringement.", icon: Copyright, elements: [{icon: ShieldCheck, pos: "top-8 left-12", size: 24}, {icon: FileText, pos: "bottom-10 right-12", size: 20}] },
      ]
    },
    {
      id: "exit",
      title: "Exit (The End)",
      icon: LogOut,
      desc: "Services for founders who are moving on. Whether closing a company or restructuring, we ensure a clean legal exit so you can start your next chapter.",
      services: [
        { title: "Company Closure", desc: "Move on without the baggage. Closing a company requires ROC clearance and zero liabilities. We handle the strike-off process seamlessly.", icon: XCircle, elements: [{icon: Building2, pos: "top-10 right-10", size: 22}, {icon: FileText, pos: "bottom-8 left-12", size: 20}] },
      ]
    }
  ];

  useGSAP(() => {
    // Reveal animation for the header
    gsap.fromTo(".concierge-header", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%" }}
    );

    // Stacking Card Effect
    cardsRef.current.forEach((card, index) => {
      // Scale down previous cards as new ones stack on top
      if (index < cardsRef.current.length - 1) {
        gsap.to(card, {
          scale: 0.94 - (cardsRef.current.length - index) * 0.01,
          opacity: 0.6,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current[index + 1],
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          }
        });
      }

      // Entrance animation for each main category card
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" } }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="concierge-header text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Concierge</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f172a] mb-6 tracking-tight leading-[1.1]">
            Full-Service <span className="text-blue-600">Statutory Compliance</span> When You Need It
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            AI identifies an issue. You click Resolve. Our experts handle the rest or your own consultant does, right inside the platform. Every service assigned and tracked in your dashboard.
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative pb-24">
          {conciergeData.map((category, index) => (
            <div 
              key={category.id} 
              ref={el => cardsRef.current[index] = el}
              // The sticky class combined with top positioning creates the stacking effect
              className="sticky w-full bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
              style={{ top: `${120 + index * 20}px`, zIndex: index }}
            >
              <div className="p-8 lg:p-12">
                
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <category.icon size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{category.desc}</p>
                  </div>
                </div>

                {/* Services Grid */}
                <div className={`grid md:grid-cols-2 ${category.services.length >= 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
                  {category.services.map((service, idx) => (
                    <div key={idx} className="group bg-white border border-slate-100 rounded-2xl flex flex-col hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300">
                      
                      <IllustrationPlaceholder icon={service.icon} elements={service.elements} />
                      
                      <div className="p-6">
                        <h5 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}