
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { UserPlus, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-cyan-100/40 to-transparent rounded-bl-full pointer-events-none blur-3xl animate-pulse-slow"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-xl shadow-cyan-500/10 border border-slate-100 transform -rotate-3">
            <UserPlus size={28} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Join Aquacare and start your sustainable journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl py-10 px-6 shadow-2xl shadow-slate-200/50 border border-white/60 sm:rounded-3xl sm:px-12">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 animate-slide-up">
                <AlertCircle size={18} className="flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-0 rounded-xl text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-cyan-400 focus:bg-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 sm:text-sm font-medium shadow-inner-soft"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-0 rounded-xl text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-cyan-400 focus:bg-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 sm:text-sm font-medium shadow-inner-soft"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border-0 rounded-xl text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-cyan-400 focus:bg-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 sm:text-sm font-medium shadow-inner-soft"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-cyan-500/20 text-sm font-bold text-white bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-bold text-slate-900 hover:text-cyan-600 transition-colors">
                  Sign in here
                </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
