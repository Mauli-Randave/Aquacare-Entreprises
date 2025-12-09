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

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by AI Recommendation (High Priority)
    if (aiRecommendation) {
      result = result.filter(p => aiRecommendation.ids.includes(p.id));
    } 
    // 3. OR Filter by Standard Text Search (Low Priority, only if no AI results active)
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
    <div className="min-h-screen bg-slate-50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shop Products</h1>
              <p className="text-slate-500 text-sm mt-1">
                 {loading ? 'Loading...' : `Found ${filteredProducts.length} items`}
              </p>
            </div>

            {/* AI Search Bar */}
            <div className="w-full md:w-1/2 relative">
               <div className="relative group">
                 <input
                  type="text"
                  placeholder="Ask AI: 'Best filter for hard water'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="w-full pl-12 pr-24 py-3 rounded-xl border border-slate-200 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-200 outline-none transition-all"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 
                 <button 
                   onClick={handleAiSearch}
                   disabled={isAiSearching || !searchQuery}
                   className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-4 rounded-lg text-sm font-medium hover:bg-aqua-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                 >
                   {isAiSearching ? (
                     <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                   ) : (
                     <>
                      <Sparkles size={14} /> AI Search
                     </>
                   )}
                 </button>
               </div>
            </div>
          </div>

          {/* AI Recommendation Message */}
          {aiRecommendation && (
            <div className="mt-6 bg-aqua-50 border border-aqua-100 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <Sparkles className="text-aqua-600 mt-1 flex-shrink-0" size={20} />
              <div className="flex-grow">
                <h4 className="font-semibold text-aqua-900 text-sm">AI Recommendation</h4>
                <p className="text-aqua-800 text-sm mt-1">{aiRecommendation.reasoning}</p>
              </div>
              <button onClick={clearAiResults} className="text-aqua-400 hover:text-aqua-700">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
             <div className="text-center py-20 text-slate-400">Loading catalog...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
              <Filter className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No products found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setAiRecommendation(null); }}
              className="mt-4 text-aqua-600 font-medium hover:underline"
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