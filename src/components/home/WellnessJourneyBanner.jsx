import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export const WellnessJourneyBanner = () => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Banner Box */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#dcf0e4] via-[#eaf6ee] to-[#dcf0e4] rounded-3xl p-6 sm:p-9 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          {/* Decorative Leaves Left */}
          <div className="absolute left-0 bottom-0 pointer-events-none opacity-50 sm:opacity-70 h-full flex items-end">
            <img
              src="/images/home/banner-leaves-left.png"
              alt=""
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </div>

          {/* Decorative Leaves Right */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-50 sm:opacity-70 h-full flex items-end">
            <img
              src="/images/home/banner-leaves-right.png"
              alt=""
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </div>

          {/* Left Text & Icon */}
          <div className="relative z-10 flex items-start sm:items-center gap-4 pl-0 sm:pl-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#137333] shrink-0 border border-emerald-100">
              <Leaf className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#0f2e24] leading-snug">
                Start Your Wellness Earning Journey Today!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
                Join DirectGrow, refer friends, and build a sustainable income with trusted Ayurvedic products.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="relative z-10 shrink-0 self-start sm:self-auto pr-0 sm:pr-3">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

