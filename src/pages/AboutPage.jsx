import React from 'react';
import { Logo } from '../components/common/Logo';
import { 
  Leaf, 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles, 
  Heart,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-xs text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-block">
            <Logo className="h-16 mx-auto" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Restoring Vedic Wellness. Empowering Direct Sellers.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            DirectGrow was established to bridge ancient Ayurvedic science with a transparent, modern 8-level social commerce model. We believe true wellness begins with purity, and true financial freedom begins with honesty.
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Purity Above All</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every herb in DirectGrow formulations is wild-harvested at peak potency, strictly free of synthetic binders, parabens, artificial colors, or heavy-metal contaminants.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Direct Selling Compliance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Operating with strict fidelity to the Consumer Protection (Direct Selling) Rules 2021. DirectGrow rejects pyramid structures; every rupee distributed is backed by real, consumed products.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">8-Level Equal Opportunity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our 8-tier referral plan guarantees that distributor compensation is distributed equitably across both direct sponsors and multi-generation community builders.
            </p>
          </div>
        </div>

        {/* Corporate Information */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl font-black text-white">DirectGrow Corporate Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div>
              <h4 className="font-bold text-emerald-400 mb-1">Corporate Headquarters</h4>
              <p>DirectGrow Health Sciences Private Limited</p>
              <p>Bandra-Kurla Complex (BKC), Mumbai, Maharashtra 400051</p>
            </div>

            <div>
              <h4 className="font-bold text-brand-400 mb-1">Manufacturing & Quality</h4>
              <p>GMP Certified Ayurvedic Formulation Facility</p>
              <p>Approved under AYUSH License #AYU-MH-2024-8891</p>
            </div>

            <div>
              <h4 className="font-bold text-purple-400 mb-1">Customer & Distributor Care</h4>
              <p>Toll-Free Helpline: 1800-200-GROW</p>
              <p>Direct Support: care@directgrow.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

