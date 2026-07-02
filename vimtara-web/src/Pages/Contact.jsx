import { useRef } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(() => {
    // Hero Section Animations
    const tl = gsap.timeline();
    tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 })
      .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4");

    // Left Column Info Cards Stagger
    gsap.fromTo(leftColRef.current.children,
      { y: 40, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: leftColRef.current, start: "top 80%" }
      }
    );

    // Right Column Form Reveal
    gsap.fromTo(formRef.current,
      { y: 60, opacity: 0, scale: 0.98 },
      { 
        y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 80%" }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-200">
      
      {/* --- HERO SECTION --- */}
      {/* Fixed: Changed pb-48 to pb-24 to remove excess dark space */}
      <section className="relative pt-32 pb-24 bg-[#0b1221] overflow-hidden rounded-b-[3rem]">
        {/* Ambient Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <div className="hero-badge flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            Our experts are online
          </div>
          
          <h1 className="hero-title text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Contact <span className="text-blue-400 drop-shadow-[0_0_30px_rgba(96,165,250,0.2)]">Us</span>
          </h1>
          
          <p className="hero-desc text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about our services or need assistance? We're here to help you navigate your compliance journey.
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      {/* Fixed: Removed -mt-24 and added pt-12 to push content below the dark background */}
      <section className="max-w-7xl mx-auto px-6 relative z-30 pt-12 mb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Contact Info */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-6">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Get in Touch</h2>
              <p className="text-slate-600 leading-relaxed">
                Whether you're a founder looking to incorporate or a CFO managing complex compliance, our experts are just a message away.
              </p>
            </div>

            {/* Email Card */}
            <div className="group flex items-start gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                <a href="mailto:support@vimtara.com" className="text-blue-600 font-medium hover:underline block mb-2">support@vimtara.com</a>
                <p className="text-xs text-slate-500">Our team typically responds within 24 hours.</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group flex items-start gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                <p className="text-slate-700 font-medium mb-2">+91 8795990099</p>
                <p className="text-xs text-slate-500">Monday – Saturday: 10:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="group flex items-start gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Our Office</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kh No 275/175, 1st Floor, Street No 1-A,<br />
                  Village Wazirabad, Wazirabad Village,<br />
                  North Delhi, Delhi, India 110084
                </p>
              </div>
            </div>

            {/* Existing Customer Box */}
            <div className="mt-10 p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Existing Customer?</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Log in to your dashboard to raise a support ticket or track your service request in real-time.
              </p>
              <button className="w-full py-3 bg-white border border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group">
                Login to Dashboard <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div ref={formRef} className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-100 relative">
              
              <div className="mb-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Send us a message</h3>
                <p className="text-slate-500 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">First Name *</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Last Name *</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email *</label>
                    <input 
                      type="email" 
                      placeholder="john@company.com" 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                  {/* Company */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Company</label>
                    <input 
                      type="text" 
                      placeholder="Your Company Name" 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Inquiry Type *</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select inquiry type</option>
                    <option value="incorporation">Company Incorporation</option>
                    <option value="gst_tax">GST & Tax Compliance</option>
                    <option value="esop">ESOP & Equity Management</option>
                    <option value="partnership">Partnership / CA Network</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Message *</label>
                  <textarea 
                    placeholder="How can we help you?" 
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
                >
                  Send Message <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}