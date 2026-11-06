import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShoppingCart
} from 'lucide-react';

export const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total 
  } = useCart();
  
  const navigate = useNavigate();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb matching screenshot: Home > Cart */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-medium">
          <Link to="/" className="hover:text-[#137333] transition-colors">
            Home
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-800 font-bold">Cart</span>
        </div>

        {/* Page Title: Your Shopping Basket (2 Items) */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2e24] tracking-tight mb-8">
          Your Shopping Basket <span className="text-[#137333]">({totalItems} {totalItems === 1 ? 'Item' : 'Items'})</span>
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500">
              Browse our authentic Ayurvedic formulations to start your wellness journey.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#137333] hover:bg-[#0f5c29] text-white font-bold text-xs px-6 py-3 rounded-full shadow-xs transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Card (col-span-8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm divide-y divide-slate-100">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-[10px] font-bold text-[#137333] bg-[#eef8f2] border border-[#a8dab5] px-2.5 py-0.5 rounded-full">
                          Qualifying Pack
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Selector, Price, and Trash */}
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    
                    {/* Quantity Pill Selector: - 1 + */}
                    <div className="flex items-center border border-slate-200 rounded-full px-3 py-1 bg-white gap-3.5 text-xs font-bold text-slate-800 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-slate-400 hover:text-slate-800 px-1 text-sm font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        —
                      </button>
                      <span className="w-4 text-center font-extrabold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-slate-400 hover:text-slate-800 px-1 text-sm font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <span className="font-bold text-slate-900 text-base sm:text-lg min-w-[70px] text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>

                  </div>

                </div>
              ))}
            </div>

            {/* Right: Order Summary Card (col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
              
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs pt-1">
                {/* Cart Subtotal */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Cart Subtotal ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-[#137333]">FREE</span>
                </div>
              </div>

              {/* Total Amount Highlight Box */}
              <div className="bg-[#eaf7ee] rounded-2xl p-4 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Total Amount
                </span>
                <span className="font-extrabold text-[#137333] text-xl sm:text-2xl">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#137333] hover:bg-[#0f5c29] text-white py-3.5 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4 stroke-[2]" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Continue Shopping Link */}
              <Link
                to="/products"
                className="text-[#137333] hover:underline text-xs font-bold text-center block pt-2"
              >
                ← Continue Shopping
              </Link>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
