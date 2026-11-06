import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Layers
} from 'lucide-react';

export const HeroSection = () => {
  const { currentUser } = useAuth();

  return (
    <section className="relative overflow-hidden bg-white pt-2 sm:pt-3 lg:pt-4 pb-10 sm:pb-14">
      
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Text & Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left pt-1 lg:pt-2">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf7f0] text-[#137333] border border-[#d3eed9] text-xs font-bold shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-[#137333]" />
              <span>8-Level Referral Program</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#0f2e24] tracking-tight leading-[1.12]">
              Pure Ayurvedic Healing.<br />
              Earn with Our <span className="text-[#137333]">8-Level</span><br />
              Referral Plan.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
              Buy authentic Ayurvedic products and earn commission on every purchase through your referral network.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to={currentUser ? "/account" : "/join"}
                className="bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Become a Member</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-slate-200 shadow-xs transition-all hover:border-slate-300"
              >
                <span>Browse Products</span>
              </Link>
            </div>
          </div>

          {/* Right Product Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative z-10 w-full max-w-lg">
              <img
                src="/images/home/hero-ayurveda.png"
                alt="Pure Ayurvedic Formulations"
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>

        </div>

        {/* 3 Quick Features Row with Vertical Dividers (Exact Match to Screenshot) */}
        <div className="mt-8 sm:mt-10 pt-4 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
            
            {/* Feature 1: Authentic Products */}
            <div className="flex items-center gap-3.5 flex-1 md:pr-6">
              <div className="w-11 h-11 rounded-2xl bg-[#eaf7ee] text-[#137333] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Authentic Products</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">AYUSH certified formulations</p>
              </div>
            </div>

            {/* Vertical Divider 1 */}
            <div className="h-9 w-px bg-slate-200 hidden md:block" />

            {/* Feature 2: 8-Level Income */}
            <div className="flex items-center gap-3.5 flex-1 md:px-6">
              <div className="w-11 h-11 rounded-2xl bg-[#eaf7ee] text-[#137333] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">8-Level Income</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Earn up to 8 levels of commission</p>
              </div>
            </div>

            {/* Vertical Divider 2 */}
            <div className="h-9 w-px bg-slate-200 hidden md:block" />

            {/* Feature 3: Secure & Transparent */}
            <div className="flex items-center gap-3.5 flex-1 md:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-[#eaf7ee] text-[#137333] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Secure & Transparent</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Track your earnings anytime</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
