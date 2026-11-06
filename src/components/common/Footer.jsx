import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="relative bg-[#08241b] text-white py-8 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-emerald-950">
      
      {/* Decorative Leaves Graphic Far Right */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-80 h-full flex items-end">
        <img
          src="/images/products/footer-leaves.png"
          alt=""
          className="h-14 sm:h-16 w-auto object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Logo variant="white" className="h-9 sm:h-10" />

          <div className="hidden lg:block w-px h-8 bg-white/20" />
        </div>

        {/* Center: Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Quick Links
          </h4>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs text-slate-200">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-emerald-400 transition-colors">
              Products
            </Link>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">
              Referral Plan
            </a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              About Us
            </a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Right: Follow Us */}
        <div className="text-center md:text-right pr-0 sm:pr-8">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Follow Us
          </h4>
          <div className="flex items-center justify-center md:justify-end gap-2 text-white">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
            >
              f
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
            >
              📷
            </a>
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
            >
              in
            </a>
            <a
              href="#youtube"
              aria-label="YouTube"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
            >
              ▶
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
