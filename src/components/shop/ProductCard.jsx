import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative">
      
      {/* Top Section: Category Badge + Packshot Image */}
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between mb-1">
          {product.isQualifying ? (
            <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              <span>Qualifies 8L</span>
            </span>
          ) : <div />}

          <span className="text-[10px] font-bold text-[#137333] bg-[#eef8f2] border border-[#a8dab5] px-2.5 py-0.5 rounded-full ml-auto">
            {product.category}
          </span>
        </div>

        {/* Product Image Link */}
        <Link to={`/products/${product.id}`} className="block">
          <div className="w-full h-32 sm:h-36 flex items-center justify-center p-2 my-1 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
        </Link>

        {/* Product Title */}
        <Link to={`/products/${product.id}`} className="block mt-2">
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#137333] transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {product.shortDesc}
        </p>
      </div>

      {/* Bottom Row: Price & Add to Cart */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100">
        <span className="text-base sm:text-lg font-black text-[#137333]">
          {formatCurrency(product.price)}
        </span>

        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs active:scale-95 ${
            added 
              ? 'bg-[#137333] text-white border border-[#137333]' 
              : 'bg-[#eef8f2] hover:bg-[#137333] text-[#137333] hover:text-white border border-[#a8dab5]'
          }`}
          title="Add to Cart"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
