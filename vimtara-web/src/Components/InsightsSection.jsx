import { useRef } from 'react';
import { ArrowRight, FileText, Activity, Shield, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const BlogPlaceholder = ({ icon: Icon, title }) => (
  <div className="w-full h-56 bg-[#0b1221] relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
    {/* Abstract Tech Background Elements */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-[60px]"></div>
    <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px]"></div>
    
    {/* Center Icon */}
    <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
      <Icon size={32} className="text-blue-400" strokeWidth={1.5} />
    </div>
    
    {/* Overlay Gradient for readability if you add real images later */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] to-transparent opacity-60"></div>
  </div>
);

export default function InsightsSection() {
  const containerRef = useRef(null);

  const insights = [
    {
      tag: "Statutory Compliance",
      date: "June 29, 2026",
      title: "Statutory Compliance Software for MCA V3 Automation",
      excerpt: "Key takeaways: MCA V3 has changed the way companies handle statutory filing. Annual compliance processes must now integrate with specific API standards...",
      icon: FileText
    },
    {
      tag: "AI Statutory Compliance",
      date: "June 26, 2026",
      title: "How Compliance Management Software Helps You Audit Corporate Health",
      excerpt: "Key Takeaways: What You'll Learn. Why it Matters. Why compliance is a business health indicator. Prevent director disqualifications and severe MCA penalties...",
      icon: Activity
    },
    {
      tag: "AI Statutory Compliance",
      date: "June 24, 2026",
      title: "Secure Business Continuity via Compliance Management Software",
      excerpt: "Key Takeaways: The Hidden Threat to Business Growth. Imagine driving a fast car on a busy highway with a blindfold. That is scaling without compliance oversight...",
      icon: Shield
    }
  ];

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".insights-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
    );

    // Cards Staggered Reveal with slight rotation for 3D feel
    gsap.fromTo(".insight-card",
      { y: 80, opacity: 0, rotateX: 10, transformPerspective: 1000 },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out", 
        scrollTrigger: { trigger: ".insight-card-container", start: "top 80%" } 
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white py-24 lg:py-32 relative">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="insights-header text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Insights</h2>
          <h3 className="insights-header text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">
            <span className="text-blue-600">Compliance Intelligence</span> for Indian Founders
          </h3>
          <p className="insights-header text-slate-600 text-lg max-w-2xl mx-auto">
            Practical guides, deadline calendars, and expert explainers, written for people running companies.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="insight-card-container grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-16">
          {insights.map((article, idx) => (
            <article 
              key={idx} 
              className="insight-card group flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 cursor-pointer"
            >
              {/* Image Area */}
              <div className="relative overflow-hidden">
                <BlogPlaceholder icon={article.icon} title={article.title} />
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={16} className="text-blue-600" />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                    {article.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {article.date}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {article.excerpt}
                </p>
                
                {/* Minimalist read more link that appears on hover */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
                  Read Article <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
          <button className="insights-header group px-8 py-3.5 bg-white border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
            View More <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}