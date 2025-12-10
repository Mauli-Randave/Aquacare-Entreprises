
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingCart, Star, ArrowLeft, Truck, Shield } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);
  
  // Simple "AI" related products logic (Same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product, products]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-medium">Loading details...</div>;

  if (!product) {
    return <div className="p-20 text-center text-slate-500 font-medium">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-24 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-8 transition-colors font-medium">
          <ArrowLeft size={18} className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-white dark:border-slate-800">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="grid grid-cols-3 gap-4">
               {/* Placeholders for gallery thumbnails */}
               {[1, 2, 3].map(i => (
                 <div key={i} className="aspect-square bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all"></div>
               ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wide text-sm mb-3">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-solar-500 bg-solar-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-solar-100 dark:border-slate-700">
                <Star className="fill-current w-4 h-4" />
                <span className="ml-1 font-bold text-slate-900 dark:text-white">{product.rating}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">{product.reviews} verified reviews</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className={`${product.stock > 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'text-red-600 bg-red-50 border-red-100'} px-3 py-1 rounded-full border text-sm font-bold`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">₹{product.price.toLocaleString()}</div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8 border-l-4 border-cyan-200 dark:border-cyan-800 pl-6">
              {product.description}
            </p>

            <div className="space-y-4 mb-10">
              {product.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-10">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/10 hover:shadow-cyan-500/25"
              >
                <ShoppingCart /> Add to Cart
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <Truck className="text-cyan-500" size={28} />
                <div className="text-sm">
                  <div className="font-bold text-slate-900 dark:text-white">Free Delivery</div>
                  <div className="text-slate-500 dark:text-slate-400">2-3 Business Days</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <Shield className="text-cyan-500" size={28} />
                <div className="text-sm">
                  <div className="font-bold text-slate-900 dark:text-white">Warranty</div>
                  <div className="text-slate-500 dark:text-slate-400">1 Year Coverage</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32 border-t border-slate-200 dark:border-slate-800 pt-16">
          <h2 className="text-3xl font-display font-bold mb-10 text-slate-900 dark:text-white">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <div key={p.id}>
                <Link to={`/product/${p.id}`} className="block group">
                  <div className="aspect-square bg-white dark:bg-slate-900 rounded-2xl mb-4 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-lg transition-all duration-500">
                     <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">{p.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">₹{p.price.toLocaleString()}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
