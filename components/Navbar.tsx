
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LayoutDashboard, User, LogIn, LogOut, Filter, Droplets, Sun, Moon, Phone } from 'lucide-react';
import { useCart } from '../App';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COMPANY_DETAILS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isHome = location.pathname === '/';

  // Handle scroll effect for transparent -> glass transition
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = async () => {
    await signOut();
    setShowSignOutConfirm(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Dynamic Styles Calculation
  const isTransparent = isHome && !scrolled;

  const navBgClass = isTransparent 
    ? 'bg-transparent py-5' 
    : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 shadow-lg shadow-slate-900/5 py-3';

  // Text Colors
  const textColorClass = isTransparent 
    ? 'text-white/90 hover:text-white' 
    : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400';
    
  const activeTextClass = isTransparent 
    ? 'text-white font-bold' 
    : 'text-cyan-600 dark:text-cyan-400 font-bold';

  // Logo Colors
  const logoTextClass = isTransparent ? 'text-white' : 'text-slate-900 dark:text-white';
  const logoSubTextClass = isTransparent ? 'text-cyan-200' : 'text-cyan-600 dark:text-cyan-400';
  
  // Logo Icon Box
  const logoBgClass = isTransparent 
    ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
    : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30';
    
  const logoIconClass = 'text-white'; 

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${navBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 group-hover:scale-105 overflow-hidden ${logoBgClass}`}>
                 <Filter className={`h-6 w-6 relative z-10 ${logoIconClass}`} />
                 <Droplets className="h-3 w-3 text-cyan-200 absolute bottom-1.5 right-1.5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-display font-black tracking-tight leading-none transition-colors duration-300 ${logoTextClass}`}>
                  AQUACARE
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] leading-none mt-0.5 transition-colors duration-300 ${logoSubTextClass}`}>
                  Enterprises
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                    isActive(link.path) ? activeTextClass : textColorClass
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isTransparent ? 'bg-cyan-300' : 'bg-cyan-500'} ${isActive(link.path) ? 'w-full' : ''}`}></span>
                </Link>
              ))}
              
              {/* Contact Info (Visible on Desktop) */}
              <div className={`hidden lg:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${isTransparent ? 'border-white/20 text-white/80' : 'border-slate-200 text-slate-500'}`}>
                  <Phone size={12} />
                  <span>{COMPANY_DETAILS.adminPhone}</span>
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${textColorClass}`}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Admin Link */}
              <Link to="/admin" className={`transition-all hover:scale-110 duration-300 ${textColorClass}`} title="Admin Dashboard">
                 <LayoutDashboard size={20} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className={`relative p-2 transition-transform hover:scale-110 duration-300 group ${textColorClass}`}>
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md border-2 border-transparent">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth Buttons */}
              {user ? (
                <div className={`flex items-center gap-4 border-l pl-6 ${isTransparent ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <Link to="/profile" className={`flex items-center gap-2 text-sm font-medium transition-colors ${textColorClass}`}>
                    <User size={18} />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>
                  <button 
                    onClick={handleSignOutClick}
                    className={`transition-colors hover:rotate-90 duration-300 ${isTransparent ? 'text-red-300 hover:text-red-200' : 'text-red-400 hover:text-red-600'}`}
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className={`border-l pl-6 ${isTransparent ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <Link 
                    to="/login"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                      isTransparent 
                        ? 'bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/30' 
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                    }`}
                  >
                    <LogIn size={16} />
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button onClick={toggleTheme} className={textColorClass}>
                 {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
               </button>
               <Link to="/cart" className={`relative p-2 ${textColorClass}`}>
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`focus:outline-none transition-colors ${textColorClass}`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 animate-slide-up shadow-2xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                     isActive(link.path) 
                     ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold' 
                     : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
               <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
                
                <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOutClick}
                        className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 shadow-lg"
                    >
                      Log In / Register
                    </Link>
                  )}
                </div>
            </div>
          </div>
        )}
      </nav>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-white/20 dark:border-slate-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <LogOut size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Sign Out?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSignOut}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
