import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../App';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-bold text-slate-800 shadow-sm">
          ${product.price}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-aqua-600 font-semibold mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 hover:text-aqua-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-solar-500 fill-current" />
          <span className="ml-1 text-sm text-slate-600">{product.rating}</span>
          <span className="mx-1 text-slate-300">•</span>
          <span className="text-sm text-slate-500">{product.reviews} reviews</span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-aqua-600 active:scale-95 transition-all duration-200"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;