
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { useCart } from '../App';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20 dark:hover:shadow-cyan-900/40 hover:-translate-y-2 h-full flex flex-col">
      
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Floating Glass Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white shadow-sm border border-white/20">
                {product.category}
            </span>
            {product.stock < 10 && product.stock > 0 && (
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
                    <Zap size={10} className="fill-current" /> Low Stock
                </span>
            )}
        </div>

        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Action Buttons - Slide Up on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-30 flex gap-3">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors shadow-lg"
            >
              <ShoppingCart size={18} /> Add
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="px-4 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <Eye size={20} />
            </Link>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative z-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <Link to={`/product/${product.id}`} className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white leading-tight">
                    {product.name}
                </h3>
            </Link>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-solar-500 fill-current" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
            </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Price</span>
                <span className="text-xl font-display font-bold text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString()}
                </span>
            </div>
            <div className="text-xs font-medium text-slate-400 group-hover:text-cyan-600 transition-colors">
                View Details →
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
