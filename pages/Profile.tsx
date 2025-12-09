import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-8 text-center">Please log in to view profile.</div>;

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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-slate-900 px-6 py-8 flex items-center gap-6">
             <div className="w-20 h-20 rounded-full bg-aqua-500 flex items-center justify-center text-white text-3xl font-bold">
               {user.email?.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 className="text-xl font-bold text-white mb-1">Welcome back!</h2>
               <div className="flex items-center gap-2 text-slate-300 text-sm">
                 <Mail size={14} />
                 {user.email}
               </div>
               <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                 <Shield size={14} />
                 User ID: {user.id.slice(0, 8)}...
               </div>
             </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Key size={20} className="text-aqua-600" /> Security Settings
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="max-w-md">
              {message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 outline-none transition-all"
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !newPassword}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-aqua-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
        
        <button onClick={signOut} className="text-red-600 font-medium hover:underline">
          Sign Out of all devices
        </button>
      </div>
    </div>
  );
};

export default Profile;