
import React from 'react';
import { useCart } from '../App';
import { Trash2, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 pt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 sm:gap-6 items-center transition-colors">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{item.category}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 shadow-sm hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-50 dark:text-white"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium text-slate-900 dark:text-white w-4 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 shadow-sm hover:text-cyan-600 dark:hover:text-cyan-400 dark:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                  <span className="font-bold text-slate-900 dark:text-white text-2xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mb-4">
                Checkout <ArrowRight size={18} />
              </button>
              
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                <CreditCard size={12} /> Secure Checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
