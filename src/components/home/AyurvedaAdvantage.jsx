import React from 'react';
import { Leaf, Award, CheckCircle, Shield, Sparkles } from 'lucide-react';

export const AyurvedaAdvantage = () => {
  const pillars = [
    {
      title: "Wild-Harvested Herbs",
      desc: "Sourced from authentic geographical habitats: Grade-A Shilajit from 18,000ft Himalayas, and organic Ashwagandha from Nagaur.",
      icon: Leaf,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      title: "Classical Shodhana Vidhi",
      desc: "Purified according to classical Charaka & Sushruta Samhita techniques using Triphala decoctions and cow milk Kshirapaka.",
      icon: Award,
      color: "text-brand-600 bg-brand-50 border-brand-200"
    },
    {
      title: "AYUSH Ministry Standards",
      desc: "Heavy-metal tested, pesticide-free, non-GMO, and formulated in GMP and ISO 9001 certified state-of-the-art facilities.",
      icon: Shield,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
      title: "High Bio-Availability",
      desc: "Enhanced with natural bio-enhancers like Piperine and A2 Gir Cow Ghee for cellular absorption rather than passing unutilized.",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 border-amber-200"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Images / Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                alt="Ayurvedic herbs and holistic wellness"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    5,000 Years of Vedic Wisdom
                  </span>
                  <p className="text-lg font-black">
                    Authentic Herbs. Tangible Results.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping small badge */}
            <div className="absolute -bottom-6 -right-6 bg-emerald-700 text-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
              <Leaf className="w-8 h-8 text-emerald-300" />
              <div>
                <p className="text-xs font-bold">100% Herbal</p>
                <p className="text-[10px] text-emerald-200">Zero Synthetic Fillers</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>The DirectGrow Standard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Why DirectGrow Products Drive High Recurring Repeat Sales
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              In direct selling, the foundation of every thriving network is authentic product efficacy. Our products aren't gimmicks—they are doctor-approved, classical Ayurvedic formulations that deliver genuine wellness transformations, ensuring distributors enjoy natural monthly re-orders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div key={p.title} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${p.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">{p.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

