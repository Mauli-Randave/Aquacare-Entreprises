import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingCart, Star, ArrowLeft, Truck, Shield } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCart } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const product = PRODUCTS.find(p => p.id === id);
  
  // Simple "AI" related products logic (Same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return <div className="p-12 text-center">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <Link to="/shop" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-4">
               {/* Placeholders for gallery thumbnails */}
               {[1, 2, 3].map(i => (
                 <div key={i} className="aspect-square bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:border-aqua-400 transition-colors"></div>
               ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-aqua-600 font-bold uppercase tracking-wide text-sm mb-2">{product.category}</div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-solar-500">
                <Star className="fill-current w-5 h-5" />
                <span className="ml-1 font-bold text-slate-900">{product.rating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{product.reviews} reviews</span>
              <span className="text-slate-300">|</span>
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mb-8">${product.price}</div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-aqua-100 flex items-center justify-center text-aqua-600 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-4 border-t border-slate-100 pt-8">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-aqua-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
              >
                <ShoppingCart /> Add to Cart
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                <Truck className="text-slate-400" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">Free Delivery</div>
                  <div className="text-slate-500">2-3 Business Days</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                <Shield className="text-slate-400" />
                <div className="text-sm">
                  <div className="font-semibold text-slate-900">Warranty</div>
                  <div className="text-slate-500">1 Year Coverage</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <div key={p.id}>
                <Link to={`/product/${p.id}`} className="block group">
                  <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden">
                     <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-aqua-600">{p.name}</h3>
                  <p className="text-slate-500">${p.price}</p>
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