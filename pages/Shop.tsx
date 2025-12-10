
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { searchProductsWithAI } from '../services/geminiService';

const Shop: React.FC = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ ids: string[], reasoning: string } | null>(null);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAiSearching(true);
    setAiRecommendation(null);
    
    try {
      const result = await searchProductsWithAI(searchQuery);
      if (result.recommendedIds && result.recommendedIds.length > 0) {
        setAiRecommendation({
          ids: result.recommendedIds,
          reasoning: result.reasoning
        });
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearAiResults = () => {
    setAiRecommendation(null);
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (aiRecommendation) {
      result = result.filter(p => aiRecommendation.ids.includes(p.id));
    } 
    else if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, aiRecommendation, searchQuery, products]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-800 p-10 mb-16 relative overflow-hidden transition-all duration-300 group">
          
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/40 to-blue-100/40 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

          <div className="flex flex-col md:flex-row gap-10 justify-between items-center relative z-10">
            
            {/* Title */}
            <div className="w-full md:w-auto">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2 block">Aquacare Store</span>
              <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">Explore Catalog</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                 {loading ? 'Syncing inventory...' : `Showing ${filteredProducts.length} premium products`}
              </p>
            </div>

            {/* AI Search Bar - Advanced Design */}
            <div className="w-full md:w-1/2 relative">
               <div className="relative group">
                 <input
                  type="text"
                  placeholder="Ask AI: 'Eco-friendly filter for home'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="w-full pl-16 pr-36 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border-0 shadow-inner-soft text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-500 focus:shadow-2xl focus:shadow-cyan-500/10 transition-all duration-300 outline-none text-lg font-medium"
                 />
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={24} />
                 
                 <button 
                   onClick={handleAiSearch}
                   disabled={isAiSearching || !searchQuery}
                   className="absolute right-3 top-3 bottom-3 bg-slate-900 dark:bg-cyan-600 text-white px-6 rounded-2xl text-sm font-bold hover:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/20 active:scale-95"
                 >
                   {isAiSearching ? (
                     <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                   ) : (
                     <>
                      <Sparkles size={16} className="text-cyan-300 dark:text-white" /> <span className="hidden sm:inline">AI Find</span>
                     </>
                   )}
                 </button>
               </div>
            </div>
          </div>

          {/* AI Recommendation Message */}
          {aiRecommendation && (
            <div className="mt-10 bg-white dark:bg-slate-800/50 border border-cyan-100 dark:border-cyan-900/50 rounded-2xl p-6 flex items-start gap-5 animate-fade-in shadow-lg shadow-cyan-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400 shrink-0">
                 <Sparkles size={24} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">AI Recommendation</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{aiRecommendation.reasoning}</p>
              </div>
              <button onClick={clearAiResults} className="text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="mt-10 flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 transform -translate-y-1'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:shadow-lg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
             <div className="flex justify-center py-32">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-cyan-500"></div>
             </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="inline-block p-8 rounded-full bg-slate-50 dark:bg-slate-800 mb-6">
              <Filter className="text-slate-300 dark:text-slate-600" size={56} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setAiRecommendation(null); }}
              className="mt-8 px-8 py-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
