
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Droplets, LayoutDashboard, User, LogIn, LogOut, Filter } from 'lucide-react';
import { useCart } from '../App';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, signOut } = useAuth();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Water Filter Theme */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl shadow-lg shadow-aqua-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
               {/* Water Filter Icon Construction */}
               <Filter className="h-6 w-6 text-aqua-400 relative z-10" />
               <Droplets className="h-3 w-3 text-white absolute bottom-1.5 right-1.5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                AQUACARE
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-aqua-600 leading-none mt-0.5">
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
                className={`text-sm font-medium transition-colors hover:text-aqua-600 ${
                  isActive(link.path) ? 'text-aqua-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Admin Link */}
            <Link to="/admin" className="text-slate-400 hover:text-slate-900 transition-colors" title="Admin Dashboard">
               <LayoutDashboard size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-aqua-600 transition-colors group">
              <ShoppingCart size={22} className="group-hover:fill-aqua-100" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-aqua-600">
                  <User size={18} />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="border-l border-slate-200 pl-4">
                <Link 
                  to="/login"
                  className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-aqua-600 transition-colors"
                >
                  <LogIn size={18} />
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <Link to="/cart" className="relative p-2 text-slate-600">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-slide-up shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                   isActive(link.path) 
                   ? 'bg-aqua-50 text-aqua-700' 
                   : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50"
              >
                Admin Dashboard
              </Link>
              
              <div className="border-t border-slate-100 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-aqua-600 hover:bg-aqua-50"
                  >
                    Log In / Register
                  </Link>
                )}
              </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
