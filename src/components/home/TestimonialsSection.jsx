import React from 'react';
import { Star, Quote, Award, CheckCircle } from 'lucide-react';

export const TestimonialsSection = () => {
  const stories = [
    {
      name: "Dr. Rajesh Sharma",
      rank: "Crown Diamond Ambassador",
      city: "Mumbai, Maharashtra",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "As an Ayurvedic physician for 22 years, I never recommended network marketing products until DirectGrow. The herbal purity is uncompromised, and the 8-level reward structure provides honest, transparent income directly into the wallet without confusing BV cuts.",
      earnings: "₹2.8 Lakh+ / Month"
    },
    {
      name: "Sunita Patel",
      rank: "Diamond Executive",
      city: "Ahmedabad, Gujarat",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote: "I started by sharing the Kumkumadi Tailam and Starter Pack with 5 friends. Today, my network spans over 1,200 active health enthusiasts across all 8 tiers. Withdrawals to my SBI account happen seamlessly within hours.",
      earnings: "₹1.4 Lakh+ / Month"
    },
    {
      name: "Amit Verma",
      rank: "Ruby Director",
      city: "Jaipur, Rajasthan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "DirectGrow's single-portal model is a breath of fresh air. No complicated distributor websites to manage. Everything from shopping to tracking my 8-level genealogy happens straight on the main site with instant referral link sharing.",
      earnings: "₹75,000+ / Month"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-brand-600" />
            <span>Real Success Stories</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Loved By Ayurvedic Doctors & Direct Sellers
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real distributors who transformed their family health and achieved financial security through our 8-level platform.
          </p>
        </div>

        {/* Stories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.name}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <span>{story.name}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                    </h4>
                    <p className="text-[10px] text-brand-600 font-semibold">{story.rank}</p>
                    <p className="text-[10px] text-slate-400">{story.city}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Earnings</span>
                  <span className="text-xs font-black text-emerald-600">{story.earnings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

