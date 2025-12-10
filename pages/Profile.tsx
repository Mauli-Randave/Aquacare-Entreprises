
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { User, Mail, Shield, Key, Check, AlertCircle, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { getOrdersByUserId } = useOrders();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-8 text-center">Please log in to view profile.</div>;

  const userOrders = getOrdersByUserId(user.id);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
      switch(status) {
          case 'Pending': return 1;
          case 'Processing': return 2;
          case 'Shipped': return 3;
          case 'Delivered': return 4;
          default: return 0;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 px-6 py-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                        {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail size={14} />
                        {user.email}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <button onClick={signOut} className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold">
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Key size={20} className="text-cyan-600" /> Security
                    </h3>
                    <form onSubmit={handleUpdatePassword}>
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-xs font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        {message.text}
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                        <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-sm"
                        placeholder="Enter new password"
                        minLength={6}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !newPassword}
                        className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-cyan-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    </form>
                </div>
            </div>

            {/* Order History */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Package className="text-cyan-600" /> Your Orders
                </h2>

                {userOrders.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">No orders yet</h3>
                        <p className="text-slate-500 text-sm mb-6">Start shopping to see your orders here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {userOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                                    <div>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Order ID</span>
                                        <span className="text-slate-900 font-mono font-bold">#{order.id}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Amount</span>
                                        <span className="text-slate-900 font-bold">₹{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    {/* Flipkart-style Status Stepper */}
                                    <div className="relative flex items-center justify-between mb-8 px-4">
                                        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-100 -z-10"></div>
                                        <div className={`absolute left-0 top-1/2 h-1 bg-green-500 -z-10 transition-all duration-500`} style={{ width: `${(getStatusStep(order.status) - 1) * 33}%` }}></div>
                                        
                                        {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                            const isCompleted = getStatusStep(order.status) > idx;
                                            const isCurrent = getStatusStep(order.status) === idx + 1;
                                            
                                            return (
                                                <div key={step} className="flex flex-col items-center bg-white px-2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${isCompleted || isCurrent ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                                                        {isCompleted || isCurrent ? <Check size={14} strokeWidth={4} /> : <div className="w-2 h-2 bg-slate-200 rounded-full"></div>}
                                                    </div>
                                                    <span className={`text-xs font-bold ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="text-sm">
                                            <p className="text-slate-500">Ordered on <span className="font-bold text-slate-900">{order.date}</span></p>
                                            <p className="text-slate-500">Expected Delivery: <span className="font-bold text-green-600">{order.deliveryDate}</span></p>
                                        </div>
                                        {order.status === 'Delivered' && (
                                            <button className="text-cyan-600 text-sm font-bold hover:underline">Download Invoice</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
