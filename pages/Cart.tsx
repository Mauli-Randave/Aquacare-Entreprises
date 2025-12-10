
import React, { useState } from 'react';
import { useCart } from '../App';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, QrCode, CheckCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { COMPANY_DETAILS } from '../constants';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'scan' | 'processing' | 'success'>('scan');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
        alert("Please login to complete your order.");
        navigate('/login');
        return;
    }
    setShowPaymentModal(true);
    setPaymentStep('scan');
  };

  const confirmPayment = () => {
    setPaymentStep('processing');
    
    // Simulate payment delay
    setTimeout(() => {
        // Create Real Order
        const today = new Date();
        const delivery = new Date();
        delivery.setDate(today.getDate() + 3); // Default 3 day delivery

        addOrder({
            userId: user?.id || 'guest',
            customerName: user?.user_metadata?.full_name || user?.email || 'Valued Customer',
            customerEmail: user?.email || '',
            customerPhone: user?.phone || '9876543210', // In real app, ask for phone
            items: cartItems,
            total: total,
            status: 'Pending',
            date: today.toISOString().split('T')[0],
            deliveryDate: delivery.toISOString().split('T')[0],
            paymentMethod: 'UPI'
        });

        // Simulate SMS Notification to Admin
        console.log(`SMS SENT TO ADMIN (${COMPANY_DETAILS.adminPhone}): New Order received! Value: ₹${total}`);
        alert(`SMS Notification Sent to ${COMPANY_DETAILS.adminPhone}: New Order Received!`);

        setPaymentStep('success');
        clearCart();
    }, 2000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    if (paymentStep === 'success') {
        navigate('/profile'); // Redirect to orders page
    }
  };

  if (cartItems.length === 0 && !showPaymentModal) {
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

              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Pay <ArrowRight size={18} />
              </button>
              
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                <CreditCard size={12} /> Secure Checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative border border-white/20">
                <button onClick={closePaymentModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {paymentStep === 'scan' && (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Scan & Pay</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Scan the QR code to complete payment of <span className="font-bold text-slate-900 dark:text-white">₹{total.toLocaleString()}</span></p>
                        
                        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-cyan-500 inline-block mb-6 relative group">
                            <QrCode size={180} className="text-slate-900" />
                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                <span className="text-xs font-bold text-cyan-600">Scan via UPI App</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={closePaymentModal} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={confirmPayment} className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-500/30">I Have Paid</button>
                        </div>
                    </div>
                )}

                {paymentStep === 'processing' && (
                    <div className="py-12 animate-fade-in">
                        <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Payment...</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Please wait a moment.</p>
                    </div>
                )}

                {paymentStep === 'success' && (
                    <div className="py-6 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Order Placed!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Your order has been successfully confirmed. A notification has been sent to the admin.</p>
                        <button onClick={closePaymentModal} className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity">
                            View Order Status
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
