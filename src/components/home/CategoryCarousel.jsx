import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: "immunity",
    name: "Immunity Care",
    image: "/images/home/cat-immunity.png",
    categoryParam: "NUTRITION"
  },
  {
    id: "digestive",
    name: "Digestive Care",
    image: "/images/home/cat-digestive.png",
    categoryParam: "NUTRITION"
  },
  {
    id: "joint",
    name: "Joint Care",
    image: "/images/home/cat-joint.png",
    categoryParam: "PERSONAL CARE"
  },
  {
    id: "skin-hair",
    name: "Skin & Hair Care",
    image: "/images/home/cat-skin.png",
    categoryParam: "BEAUTY"
  },
  {
    id: "wellness",
    name: "Daily Wellness",
    image: "/images/home/cat-daily.png",
    categoryParam: "HOME & LIVING"
  }
];

export const CategoryCarousel = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2e24] tracking-tight">
            Explore <span className="text-[#137333]">Our Products</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            A wide range of Ayurvedic formulations for your daily wellness.
          </p>
        </div>

        {/* Carousel Row with Arrows */}
        <div className="relative max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
          
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center shadow-xs shrink-0 transition-transform active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 5 Category Cards Container */}
          <div 
            ref={scrollRef}
            className="flex-1 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-2"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.categoryParam)}`}
                className="group flex-1 min-w-[135px] max-w-[170px] bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-between"
              >
                {/* Category Image */}
                <div className="w-24 h-20 sm:w-28 sm:h-22 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category Label */}
                <h3 className="font-bold text-slate-800 group-hover:text-[#137333] text-xs sm:text-sm mt-3 leading-tight transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* Right Arrow Button (Dark Green Circle) */}
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full bg-[#137333] hover:bg-[#0f5b28] text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

        {/* View All Products Button */}
        <div className="text-center mt-9">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-[#137333] text-[#137333] bg-white hover:bg-emerald-50 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-2xs hover:scale-105"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

