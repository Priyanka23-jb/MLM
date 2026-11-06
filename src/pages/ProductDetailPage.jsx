import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMLM } from '../context/MLMContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { 
  Star, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  RotateCcw, 
  Award,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useMLM();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id || p.slug === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-600">Store</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Presentation */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Product Image */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {product.isQualifying && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Qualifies 8-Level Rewards</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-xl">
                  {product.bv || 50} BV (Business Volume)
                </div>
              </div>
            </div>

            {/* Right: Info & Purchase */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500 font-medium">{product.reviewsCount} Verified Customer Reviews</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(product.price)}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      MRP {formatCurrency(product.mrp)}
                    </span>
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* 8-Level Qualification Callout */}
              {product.isQualifying ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-black">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>8-Level Qualifier Item</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Purchasing this single item meets the ₹2,000 threshold, instantly qualifying your distributor account and releasing ₹290 in commissions upstream to your 8-level sponsor network!
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Combine with other items to reach <strong className="text-slate-800">₹2,000</strong> for lifetime distributor qualification!
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Herbs Tags */}
              {product.herbs && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    🌿 Classical Ayurvedic Botanical Actives:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.herbs.map((h, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-xl"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-xs font-black text-slate-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-xs transition-all ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{added ? "Added to Cart" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-ayur-600 hover:from-brand-700 hover:to-ayur-700 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-md transition-all"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>100% Genuine Ayurvedic</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Easy 30-Day Returns</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Benefits & Dosage Tabbed Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Documented Therapeutic Benefits
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {product.benefits?.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" />
              Prescribed Dosage & Shastriya Usage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.dosage || "As directed by your Ayurvedic physician or 1 serving twice daily with warm water or milk."}
            </p>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <strong>Quality Standard:</strong> {product.certification}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

