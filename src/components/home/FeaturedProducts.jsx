import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMLM } from '../../context/MLMContext';
import { CATEGORIES, CATEGORY_INFO } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Heart, 
  Home, 
  Layers
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: "ALL", label: "ALL PRODUCTS", icon: Layers },
  { id: "NUTRITION", label: "NUTRITION", icon: Leaf },
  { id: "BEAUTY", label: "BEAUTY", icon: Sparkles },
  { id: "HOME & LIVING", label: "HOME & LIVING", icon: Home },
  { id: "PERSONAL CARE", label: "PERSONAL CARE", icon: Heart }
];

export const FeaturedProducts = () => {
  const { products } = useMLM();
  const [activeTab, setActiveTab] = useState('ALL');

  // Filter products by selected category tab
  const displayedProducts = products.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.category === activeTab;
  });

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ayush GMP Certified Direct Selling Formulations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore Our Product Categories
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
            Pure Ayurvedic wellness across Nutrition, Beauty, Home & Living, and Personal Care. Any first order of ₹2,000+ automatically qualifies your account for 8-level referral commissions.
          </p>
        </div>

        {/* 4 Core Category Navigation Bar (Inspired by Direct Selling Giants) */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs mb-8">
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tab.id === 'ALL' 
                ? products.length 
                : products.filter(p => p.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex-1 ${
                    isActive
                      ? "bg-[#142340] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Tagline & Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 px-1">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {activeTab === 'ALL' ? 'All Botanical Formulations' : activeTab}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'ALL' 
                ? 'Showing all authentic formulations across 4 direct selling categories' 
                : CATEGORY_INFO[activeTab]?.tagline || ''}
            </p>
          </div>

          <Link
            to={activeTab === 'ALL' ? '/products' : `/products?cat=${encodeURIComponent(activeTab)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>View Full {activeTab === 'ALL' ? 'Store' : activeTab} Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Sleek, Compact Products Grid (5-column desktop layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 8-Level Activation Qualifying Guarantee Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#061125] via-[#0E1E3B] to-[#12284D] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                8-Level Distributor Rights
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Make Any Qualifying Purchase of ₹2,000 Across Any Category
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you select the <strong>Nutrition Starter Pack</strong>, the <strong>Kumkumadi Luxury Beauty Ritual Box</strong>, the <strong>Copper Water Set</strong> in Home & Living, or the <strong>Personal Care Essentials Pack</strong>, reaching ₹2,000 on your first order instantly unlocks your lifetime 8-level referral commissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 text-center"
              >
                Browse All Qualifying Products
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
