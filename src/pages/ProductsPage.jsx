import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMLM } from '../context/MLMContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { 
  Filter, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  Check
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const ProductsPage = () => {
  const { products } = useMLM();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || searchParams.get('cat') || 'All Products';
  const urlSearch = searchParams.get('search') || '';

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('POPULARITY');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' or 'LIST'
  const [currentPage, setCurrentPage] = useState(1);

  // Accordion collapsible state
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);

  // Dynamic category counts from products list
  const categoryCounts = useMemo(() => {
    const counts = { "All Products": products.length };
    CATEGORIES.forEach(cat => {
      if (cat !== "All Products") {
        counts[cat] = products.filter(p => p.category === cat).length;
      }
    });
    return counts;
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.shortDesc?.toLowerCase().includes(q);
          const matchesCat = product.category?.toLowerCase().includes(q);
          const matchesHerbs = product.herbs?.some(h => h.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesCat && !matchesHerbs) return false;
        }

        // Price filter
        if (product.price > maxPrice) {
          return false;
        }

        // Stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        if (sortBy === 'RATING') return b.rating - a.rating;
        // Default: Popularity (Featured first, then rating, then reviews)
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory('All Products');
    setSearchQuery('');
    setMaxPrice(5000);
    setInStockOnly(false);
    setSortBy('POPULARITY');
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* =======================================================================
            1. TOP HEADER BANNER (EXACT MATCH TO REFERENCE SCREENSHOT)
           ======================================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#eef8f2] via-white to-[#eef8f2] rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Decorative Leaves Left */}
          <div className="absolute left-0 top-0 pointer-events-none opacity-80 h-full flex items-center">
            <img
              src="/images/products/banner-leaves-left.png"
              alt=""
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </div>

          {/* Decorative Leaves Far Right */}
          <div className="absolute right-0 top-0 pointer-events-none opacity-80 h-full flex items-center">
            <img
              src="/images/products/banner-leaves-right.png"
              alt=""
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </div>

          {/* Banner Text Heading */}
          <div className="relative z-10 max-w-xl pl-0 sm:pl-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2e24] tracking-tight">
              Our Ayurvedic <span className="text-[#137333]">Products</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
              Discover a wide range of authentic, AYUSH-certified formulations for your daily wellness.
            </p>
          </div>

          {/* Banner Composition Graphic Right (Mortar & Pestle, Powder, Leaves) */}
          <div className="relative z-10 shrink-0 self-center pr-0 sm:pr-8">
            <img
              src="/images/products/banner-ayurveda.png"
              alt="Ayurvedic Formulations"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
            />
          </div>

        </div>

        {/* =======================================================================
            2. MAIN CONTENT GRID: FILTERS SIDEBAR (LEFT) + PRODUCTS (RIGHT)
           ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* -------------------------------------------------------------------
              LEFT COLUMN: FILTER SIDEBAR (lg:col-span-3)
             ------------------------------------------------------------------- */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Filter Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Filter className="w-4 h-4 text-[#137333]" />
              <h2 className="font-bold text-slate-900 text-sm">
                Filter Products
              </h2>
            </div>

            {/* Section 1: Categories (Accordion) */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between font-bold text-xs text-slate-800 hover:text-slate-900"
              >
                <span>Categories</span>
                {categoriesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {categoriesOpen && (
                <div className="space-y-2 pt-1">
                  {CATEGORIES.map((cat) => {
                    const isChecked = selectedCategory === cat;
                    const count = categoryCounts[cat] || 0;

                    return (
                      <div
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="flex items-center gap-2.5 cursor-pointer group select-none text-xs text-slate-700 hover:text-slate-900"
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#137333] text-white shadow-2xs'
                              : 'border border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`flex-1 ${isChecked ? 'font-bold text-slate-900' : 'font-medium'}`}>
                          {cat} ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Price Range (Accordion) */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="w-full flex items-center justify-between font-bold text-xs text-slate-800 hover:text-slate-900"
              >
                <span>Price Range</span>
                {priceOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {priceOpen && (
                <div className="space-y-3 pt-1">
                  {/* Slider */}
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full accent-[#137333] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />

                  {/* Dual Price Boxes */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-600 font-medium text-center w-20">
                      ₹0
                    </div>
                    <span className="text-slate-400 font-bold">—</span>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-slate-800 font-bold text-center w-24">
                      ₹{maxPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Availability (Accordion) */}
            <div className="space-y-3 pb-2">
              <button
                onClick={() => setAvailabilityOpen(!availabilityOpen)}
                className="w-full flex items-center justify-between font-bold text-xs text-slate-800 hover:text-slate-900"
              >
                <span>Availability</span>
                {availabilityOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {availabilityOpen && (
                <div className="pt-1">
                  <div
                    onClick={() => {
                      setInStockOnly(!inStockOnly);
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer group select-none text-xs text-slate-700 hover:text-slate-900"
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                        inStockOnly
                          ? 'bg-[#137333] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`font-medium ${inStockOnly ? 'font-bold text-slate-900' : ''}`}>
                      In Stock Only
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Filter Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="w-full bg-[#137333] hover:bg-[#0f5c29] text-white font-bold text-xs py-2.5 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200 active:scale-95"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Apply Filters</span>
              </button>

              <button
                onClick={handleClearFilters}
                className="w-full text-slate-500 hover:text-slate-900 font-bold text-xs py-1.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

          </aside>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: SEARCH, TOOLBAR & PRODUCT GRID (lg:col-span-9)
             ------------------------------------------------------------------- */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Top Controls Toolbar: Search + Sort By + Grid/List View Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Search Bar (Pill Rounded) */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search products by name, category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#137333]/20 shadow-2xs"
                />
              </div>

              {/* Right Side: Sort By + View Mode Toggle */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-semibold whitespace-nowrap">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#137333]/20 shadow-2xs cursor-pointer"
                  >
                    <option value="POPULARITY">Popularity</option>
                    <option value="PRICE_LOW">Price: Low to High</option>
                    <option value="PRICE_HIGH">Price: High to Low</option>
                    <option value="RATING">Highest Rated</option>
                  </select>
                </div>

                {/* Grid View Toggle */}
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === 'GRID'
                      ? 'bg-[#137333] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                {/* List View Toggle */}
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === 'LIST'
                      ? 'bg-[#137333] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* Showing Products Count */}
            <div className="text-xs text-slate-500 font-semibold pt-1">
              Showing {filteredProducts.length} Products
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
                <p className="font-bold text-slate-800 text-base">No Products Found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any Ayurvedic products matching your selected filters. Try clearing your filters or changing search keywords.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#137333] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-[#0f5c29] transition-all shadow-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'GRID' ? (
              /* 4-Columns Product Grid (Exact match to screenshot) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* =======================================================================
                3. PAGINATION BAR (EXACT MATCH TO REFERENCE SCREENSHOT)
               ======================================================================= */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-6 pb-2 text-xs font-bold">
                
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#137333] text-white shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
